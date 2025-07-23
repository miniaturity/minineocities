import './App.css';


function App() {


  return (
    <div className="app">

      <div className="middle-frame">
        
        <div className="grid">

          <div className="header-0">
            //  mini aturi ty\\
          </div>

          <div className="left-1">
            <div className="l1-contents">
              s
            </div>
          </div>

          <div className="left-2">
            <div className="l2-contents">
              s
            </div>
          </div>

          <div className="middle-1">
            <div className="m1-contents">
              Hello. I am miniaturity. Welcome to my website. Hello.
            </div>
          </div>

          <div className="right-1">
            <div className="r1-contents">
              s
            </div>
          </div>

          <div className="right-2">
            <div className="r2-contents">
              s
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

const statusBox: React.FC = () => {

  return (
    <>
      
    </>
  );
}

interface Status {
  author: String,
  content: String,
  date: String,
}

interface StatusProps {
  status: Status
};

const status: React.FC<StatusProps> = ({ status }) => {
  return (
    <div className="status-contaiiner">
      <div className="s-title">
        <div className="s-author">
          {status.author}
        </div>
        <div className="s-date">
          {`(${status.date})`}
        </div>
      </div>
      <div className="s-content">
        {status.content}
      </div>
      <div className="s-buttons">
        
      </div>
    </div>
  );
}

export default App;
