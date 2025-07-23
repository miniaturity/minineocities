import { useEffect, useState } from 'react';
import { BiHeart, BiSolidHeart, BiShare } from "react-icons/bi";
import './App.css';

function App() {

  return (
    <div className="app">

      <div className="middle-frame">
        
        <div className="grid">

          <div className="header-0">
            //  mini aturi ty //
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
  content: string,
  date: string,
}

async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    window.alert("Status copied to clipboard!")
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

const StatusBox: React.FC = () => {
  const statuses: Status[] = require('./statuses.json');  

  return (
    <div className="status-box">
      {statuses.map((s, index) => (
        <StatusItem status={s} key={(index * Math.random()).toString()} />
      ))}
    </div>
  );
}

interface StatusProps {
  status: Status
};

const StatusItem: React.FC<StatusProps> = ({ status }) => {
  const [relativeDate, setRelativeDate] = useState<string>(status.date);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isHoveringDate, setIsHoveringDate] = useState<boolean>(false);

  useEffect(() => {
    const now: Date = new Date();
    const parsedDate: String[] = status.date.split('/');

    console.log(parsedDate);
    console.log((now.getDate()).toString() + "/" + (now.getMonth() + 1).toString() + "/" + (now.getFullYear()));

    if (Number(parsedDate[0]) !== now.getMonth() + 1 || Number(parsedDate[2]) !== now.getFullYear()) return;
    
    // There MIGHT be a better way to do this.
    switch (now.getDate() - Number(parsedDate[1])) {
      case 0:
        setRelativeDate("today");
        break;
      case 1:
        setRelativeDate("yesterday");
        break;
      case 2:
        setRelativeDate("a couple days ago");
        break;
      case 3:
        setRelativeDate("a couple days ago");
        break;
      case 4:
        setRelativeDate("a couple days ago");
        break;
      case 5:
        setRelativeDate("a couple days ago");
        break;
      case 6:
        setRelativeDate("a couple days ago");
        break;
      case 7:
        setRelativeDate("a week ago");
        break;
      default:
        setRelativeDate("over a week ago");
        break;
    }

  }, [status.date]);

  const handleMouseEnter = () => {
    setIsHoveringDate(true);
  };

  const handleMouseLeave = () => {
    setIsHoveringDate(false);
  };

  return (
    <div className="status-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="s-title">
        <div className="s-author">
          <div className="s-author-pfp">
            <img className="pfp" src="assets/images/mini.png" alt="mini"/>
          </div>
          <div className="s-author-username">
            <div className="s-author-display">
              {`mini`}
            </div>
            <div className="s-author-handle">
              {`@miniaturity`}
            </div>
          </div>
        </div>
        <div className="s-date">
          {isHoveringDate ? `(${status.date})` : `(${relativeDate})`}
        </div>
      </div>
      <div className="s-content">
        <div className="s-content-box">
        {status.content}
        </div>
      </div>
      <div className="s-buttons">
        <div className="s-button-set1">
          <button className="favorite" onClick={() => {
            setIsFavorited(prev => !prev);
          }} style={{
            color: isFavorited ? '#eb4034' : 'var(--default-color)'
          }}>
            {isFavorited ? <BiSolidHeart size={12}/> : <BiHeart size={12}/>}
          </button>
          <button className="favorite" onClick={() => {
            copyTextToClipboard(`@miniaturity (${status.date}) - \"` + status.content + "\"");
          }}>
            <BiShare size={12}/>
          </button>
        </div>
        <div className="s-buttons-replies">
          0 replies
        </div>
      </div>
    </div>
  );
}

export default App;
