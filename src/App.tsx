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
            <div className="l1-contents"> {/* Status */}
              <StatusBox />
            </div>
          </div>

          <div className="left-2">
            <div className="l2-contents"> {/* Me */}
              s
            </div>
          </div>

          <div className="middle-1">
            <div className="m1-contents"> {/* Main */}
              Hello. I am miniaturity. Welcome to my website. Hello.
            </div>
          </div>

          <div className="right-1">
            <div className="r1-contents"> {/* Contact */}
              s
            </div>
          </div>

          <div className="right-2">
            <div className="r2-contents"> {/* Projects */}
              s
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

interface Status {
  content: String,
  date: String,
}

const StatusBox: React.FC = () => {
  const statuses: Status[] = require('./statuses.json');  

  return (
    <div className="status-box">
      {statuses.map(s => (
        <StatusItem status={s} />
      ))}
    </div>
  );
}

interface StatusProps {
  status: Status
};

const StatusItem: React.FC<StatusProps> = ({ status }) => {
  return (
    <div className="status-container">
      <div className="s-title">
        <div className="s-author">
          {`mini (@miniaturity)`}
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
