import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./App.css";

function App() {
  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emaillist.map(function (item) { return item.A })
      setEmailList(totalemail)
    };

    reader.readAsArrayBuffer(file);
  }

  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendmail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully")
          setstatus(false)
        } else {
          alert("Failed")
        }
      })
  }

  return (
    <div className="app-container">
      <div className='header'>
        <h1 className="title"> BulkMail</h1>
      </div>
      <div className='subtitle'>
        <h1 className="subtitle-text">We can help your business with sending multiple emails at once</h1>
      </div>
      <div className='drag-drop'>
        <h1 className="drag-text">Drag and drop</h1>
      </div>
      <div className="content">
        <textarea
          onChange={handlemsg}
          value={msg}
          className="email-textarea"
          placeholder="Enter the email text.."></textarea>
        <div className="file-upload">
          <input type='file' onChange={handlefile} className="file-input" />
        </div>
        <p className="file-count">Total Files in the file: {emailList.length}</p>
        <button onClick={send} className="send-btn">
          {status ? "Sending..." : "Send"}
        </button>
      </div>
      <div className='footer footer-dark' />
      <div className='footer footer-light' />
    </div>
  )
}
export default App;
