import React from "react";
import CanvasBitmap from "@lib/convas"
import scancode from "@lib/keyboard"
import { SyncOutlined } from "@ant-design/icons";
import { Result, message } from "antd";
import debounce from "lodash.debounce";

// https://github.com/citronneur/mstsc.js/blob/5f17f9a4a64fc84c900e8ddf9a08c0f3a4d36947/client/js/client.js
// https://github.com/citronneur/node-rdpjs

window.client = null
class Screen extends React.Component {

  constructor(props) {
    super(props);
    this.handleResize = debounce((e) => {
      if (window.client !== null) {
        message.info(`Разрешение рабочей области изменено на ${window.innerWidth}x${window.innerHeight}`)
        window.client.close()
        setTimeout(() => this.initClient(), 500)
      }
    }, 1000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  componentDidMount() {
    this.initClient()

    this.convasElement().addEventListener("mouseenter", this.handleHover);
    this.convasElement().addEventListener("mouseleave", this.handleLeave);
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    if (window.client !== null) {
      window.client.close()
    }

    this.convasElement().removeEventListener("mouseenter", this.handleHover);
    this.convasElement().removeEventListener("mouseleave", this.handleLeave);
    console.log("DO REMOVE-----------------__<<<<<<<<<<<<<<<<<<<<<")
    window.removeEventListener('resize', this.handleResize)
  }

  initEvents() {
    console.log('init events')
    document.addEventListener("mousemove", this.handleCursor);
    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("contextmenu", this.handleContextMenu);

  }

  unbindEvents() {
    console.log('unbind events')
    document.removeEventListener("mousemove", this.handleCursor);
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("contextmenu", this.handleContextMenu);
    document.removeEventListener("contextmenu", this.handleHover);
  }

  mouseButtonMap (button) {
    switch(button) {
      case 0:
        console.log('left click')
        return 1;
      case 2:
        console.log('right click')
        return 2;
      default:
        console.log('default unknown click: ', button)
        return 0;
    }
  }

  elPosX = (e) => {
    return e.offsetX < 0 ? 0 : e.offsetX
  }
  elPosY = (e) => {
    return e.offsetY < 0 ? 0 : e.offsetY
  }

  handleCursor = (e) => {
    window.client.sendPointerEvent(this.elPosX(e), this.elPosY(e))
  }

  handleMouseUp = (e) => {
    window.client.sendPointerEvent(this.elPosX(e), this.elPosY(e), this.mouseButtonMap(e.button), false)
    e.preventDefault()
    return false
  }

  handleMouseDown = (e) => {
    window.client.sendPointerEvent(this.elPosX(e), this.elPosY(e), this.mouseButtonMap(e.button), true)
    e.preventDefault()
    return false
  }

  handleKeyUp = (e) => {
    window.client.sendKeyEventScancode(scancode(e), false)
    e.preventDefault()
    return false
  }

  handleKeyDown = (e) => {
    window.client.sendKeyEventScancode(scancode(e), true)
    e.preventDefault()
    return false
  }

  handleContextMenu = (e) => {
    window.client.sendPointerEvent(this.elPosX(e), this.elPosY(e), this.mouseButtonMap(e.button), false)
    e.preventDefault()
    return false
  }

  handleHover = (e) => {
    this.initEvents()
  }

  handleLeave = (e) => {
    this.unbindEvents()
  }

  convasElement = () => document.getElementById("screen-window")

  initClient () {

    // @TODO mousewheel
    console.log('init client for: ', this.props.ip)
    if (window.client !== null) {
      window.client.close()
    }
    const rdp = require('node-rdpjs-2')
    const convasElement = this.convasElement()

    if (!convasElement) {
      console.log('no convas element')
      return
    }

    const context = convasElement.getContext('2d');

    convasElement.width = window.innerWidth - 250; // 250px - left side
    if (convasElement.width < 600) {
      convasElement.width = 600;
    }
    convasElement.height = window.innerHeight - 64;
    context.clearRect(0, 0, convasElement.width, convasElement.height);
    convasElement.style.opacity = 1

    const convasRender = new CanvasBitmap(convasElement)
    window.client = rdp.createClient({
      domain : this.props.ip,
      userName : this.props.username,
      password : this.props.password,
      enablePerf : true,
      autoLogin : true,
      decompress : true,
      screen : { width : convasElement.width, height : convasElement.height },
      locale : 'en',
      logLevel : 'DEBUG'
    }).on('connect', (proto) => {
      console.log('connected')
      message.success(`Соединение с ${this.props.ip} открыто`)

    }).on('session', () => {
      console.log('session')

    }).on('close', () => {
      message.info(`Соединение с ${this.props.ip} закрыто`)
      this.unbindEvents()
    }).on('bitmap', (bitmap) => {
      if (convasRender === null) {
        console.log('UNDEFINED CONVAS')
      } else {
        convasRender.update(bitmap)
      }
      //console.log('bitmap', bitmap.isCompress)
    }).on('error', (err) => {
      console.log("ERR1", err)
    }).connect(this.props.ip, 3389);

    // reconnect hool
    setTimeout(() => {
      if (window.client !== null && window.client.connected === false) {
        console.log('reconnected')
        this.initClient()
      }
    }, 10000)
  }

  render() {

    return (
      <div>
        <canvas id="screen-window" style={{opacity: 0, position: "absolute", zIndex: 10}} />
        <Result
          icon={<SyncOutlined spin />}
          title="Подключение к серверу..."
          />
      </div>
    );
  }
}

export default Screen
