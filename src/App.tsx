import { useEffect, useRef, useState } from 'react';
import { BiHeart, BiSolidHeart, BiShare, BiSkipPrevious, BiPlay, BiSkipNext, BiPause, BiVolumeMute, BiVolumeFull } from "react-icons/bi";
import './App.css';

function App() {
  const msgStyle = 'color: #A6E3A1; font-size: 1rem'

  useEffect(() => {
    console.log("%cwhat're u looking at??", msgStyle);
    console.log("%chello though", msgStyle);
  }, [])

  return (
    <div className="app">

      <div className="middle-frame">
        
        <div className="grid">

          <div className="header-0">
            <span className="header-big">{`> miniaturity`}</span>
            <span className="header-small">{`mini`}</span>
          </div>

          <div className="left-1">
            <div className="l1-contents"> {/* Status */}
              <StatusBox />
            </div>
          </div>

          <div className="left-2">
            <div className="l2-contents"> {/* MP3 Player */}
              <MP3Player />
            </div>
          </div>

          <div className="middle-1">
            <div className="m1-contents"> {/* Main */}
              <span className="header-small" style={{color: "red"}}>{`HEY THERE! I'm way too lazy to design the CSS to make this layout phone friendly, view the full website on desktop!`} <br /> <br /> </span>

              {`Welcome to my ebbsite, I am miniaturity. I am a front-end developer that loves to create stylized apps and websites!`}
              <br /> <br />
              {`Contact me: @miniaturity on everything`}
              <br /> <br />
              {`This website's theme is inspired by the spotify-tui theme from spicetify. (CSS was replicated, not taken directly.)`}
              {` Thank you to the creator for the inspiration!`}
              <br /> <br />
              {`The songs section contains songs that I've been recently listening to. I'll update it sometimes. There are currently [${require('./songs.json').length}] songs available.`}
              <br /> <br />
              {`Check out my github for my projects!`} <br /> <br /> <a href="https://github.com/miniaturity" target="_blank" rel="noreferrer">https://github.com/miniaturity</a>
              <br /> <br />
              {`More about me.. I work with TypeScript, React, and CSS, which is what I used to create this website! I also sometimes work with Unity, Godot and Electron to build apps and games.`}
            </div>
          </div>

          <div className="right-1">
            <div className="r1-contents"> {/* Toybox */}
              <ToyBox />
            </div>
          </div>

          <div className="right-2">
            <div className="r2-contents"> {/* CBox */}
              <iframe src="https://www3.cbox.ws/box/?boxid=3548045&boxtag=tAf8KK" className="cbox" title="cbox"></iframe>	
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

/* Helper FunctionZ */

async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    window.alert("Status copied to clipboard!")
  } catch (err) {
    window.alert("Failed to copy text. See console for details.")
    console.error('Failed to copy text: ', err);
  }
}

const ToyBox: React.FC = () => {
  return (
    <div className="toybox">
      <span className="toybox-msg">Coming soon.</span>
    </div>
  )
}


interface Song {
  path: string,
  title: string,
  artist: string,
  albumart: string,
}


const MP3Player: React.FC = () => {
  const songs: Song[] = require('./songs.json');

  const [selectedSong, setSelectedSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = selectedSong.path;
      audioRef.current.load();
      audioRef.current.volume = 0.1;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [selectedSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedSong, songs]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playPreviousSong = () => {
    const currentIndex = songs.findIndex(song => song.path === selectedSong.path);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    setSelectedSong(songs[prevIndex]);
  };

  const playNextSong = () => {
    const currentIndex = songs.findIndex(song => song.path === selectedSong.path);
    const nextIndex = (currentIndex + 1) % songs.length;
    setSelectedSong(songs[nextIndex]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player">
      <audio ref={audioRef} preload="metadata"/>

      <div className="player-info">
        <div className="pi-img">
          <img src={selectedSong.albumart} alt={selectedSong.title} className="pi-aa"/>
        </div>
        <div className="pi-song">
          <span className="pi-title">{selectedSong.title}</span>
          <span className="pi-artist">{selectedSong.artist}</span>
        </div>
      </div>

      <div className="player-controls">
        <div className="pc-time">
          <span className="pct-current">{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>

        <div className="pc-bar-container">
          <input 
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="pc-bar"
          />
        </div>
        
        <div className="pc-controller">
          <div className="pcc-song">
            <button 
              className="pccs-prev"
              onClick={playPreviousSong}
            >
              <BiSkipPrevious size={24}/>
            </button>

            <button
              className="pccs-play"
              onClick={togglePlayPause}
            >
              {isPlaying ? <BiPause size={24}/>: <BiPlay size={24}/>}
            </button>

            <button
              className="pccs-next"
              onClick={playNextSong}
            >
              <BiSkipNext size={24}/>
            </button>
          </div>

          <div className="pcc-volume">
            <button
              className="pccv-mute"
              onClick={toggleMute}
            >
              {isMuted ? <BiVolumeMute /> : <BiVolumeFull />}
            </button>
            <div className="pccv-bar-container">
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="pccv-bar"
              />
            </div>

          </div>
        </div> 
      </div>

    </div>
  )
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
    const postedDate: String[] = status.date.split('/');

    if (Number(postedDate[0]) !== now.getMonth() + 1 || Number(postedDate[2]) !== now.getFullYear()) return;
    
    // There MIGHT be a better way to do this.
    switch (now.getDate() - Number(postedDate[1])) {
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
            copyTextToClipboard(`@miniaturity (${status.date}) - "` + status.content + "\"");
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
