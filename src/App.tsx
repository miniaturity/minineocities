import { useEffect, useRef, useState } from 'react';
import { BiHeart, BiSolidHeart, BiShare, BiSkipPrevious, BiPlay, BiSkipNext, BiPause, BiVolumeMute, BiVolumeFull } from "react-icons/bi";
import { HiMiniArrowDownRight } from "react-icons/hi2";
import './App.css';
import { animated, easings, useSpring } from '@react-spring/web';

interface JSONData {
  songs: Song[],
  statuses: Status[]
}

function App() {

  const defSong = {
    title: "804305954",
    artist: "Sickboyrari",
    albumart: "/assets/coverart/803sbr.jpg",
    path: "/assets/songs/804305954.mp3"
  }

  const defStatus = {
    content: "Error loading statuses, see console",
    date: "7/23/2025"
  }

  const defaultData = {
    songs: [defSong],
    statuses: [defStatus]
  }

  const [data, setData] = useState<JSONData>(defaultData);
  const [songs, setSongs] = useState<Song[]>(defaultData.songs);
  const [statuses, setStatuses] = useState<Status[]>(defaultData.statuses);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToy, setSelectedToy] = useState<string>("songs");
  const [cachedSongs, setCachedSongs] = useState<RecentTracks | null>(null);

  useEffect(() => {
    console.log("%cwhat're u looking at??", 'color: #A6E3A1; font-size: 1rem');
    console.log("%chello though", 'color: #A6E3A1; font-size: 1rem');

    const abortController = new AbortController();
    
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [songsRes, statusesRes] = await Promise.all([
          fetch('data/songs.json', { signal: abortController.signal }),
          fetch('data/statuses.json', { signal: abortController.signal })
        ]);

        if (!songsRes.ok || !statusesRes.ok) {
          throw new Error('One or more requests failed');
        }

        const [songs, statuses] = await Promise.all([
          songsRes.json(),
          statusesRes.json()
        ]);

        setData({ songs, statuses });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        } else {
          setError('Failed to fetch JSON Data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    setSongs(data?.songs || defaultData.songs);
    setStatuses(data?.statuses || defaultData.statuses);
  }, [data, defaultData.songs, defaultData.statuses])

  useEffect(() => {
    console.error(error);
  }, [error])

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
              {loading ? <div className="loading"> loading... </div> : <StatusBox statuses={statuses}/>}
            </div>
          </div>

          <div className={`left-2 ${selectedToy}`}>
            <div className={`l2-contents`}> {/* MP3 Player */}
              {
                (selectedToy === "songs" && (loading ? <div className="loading"> loading... </div> : <MP3Player songs={songs}/>))
              }
              {
                (selectedToy === "terminal" && (<Terminal />))
              }
              {
                (selectedToy === "lastfm" && (<LastFM cachedSongs={cachedSongs} setCachedSongs={setCachedSongs}/>))
              }
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
              {`The songs section contains songs that I've been recently listening to. I'll update it sometimes. There are currently [${songs.length}] songs available.`}
              <br /> <br />
              {`Check out my github for my projects!`} <br /> <br /> <a href="https://github.com/miniaturity" target="_blank" rel="noreferrer">https://github.com/miniaturity</a>
              <br /> <br />
              {`More about me.. I work with TypeScript, React, and CSS, which is what I used to create this website! I also sometimes work with Unity, Godot and Electron to build apps and games. `}
            </div>
          </div>

          <div className="right-1">
            <div className="r1-contents"> {/* Toybox */}
              <ToyBox setSelectedToy={setSelectedToy} selectedToy={selectedToy} />
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

interface RecentTracks {
  "recenttracks": {
    "@attr": {
      "page": number | string,
      "perPage": number | string,
      "total": number | string,
      "totalPages": number | string,
      "user": string,
    }
    "track": TrackInner[]
  }
}

interface TrackInner {
  "artist": {
          "mbid": string,
          "#text": string
        },
        "streamable": number | string,
        "image": [
          {
            "size": string
            "#text": string
          },
          {
            "size": string,
            "#text": string
          },
          {
            "size": string,
            "#text": string
          },
          {
            "size": string,
            "#text": string
          }
        ],
        "mbid": string,
        "album": {
          "mbid": string,
          "#text": string
        },
        "name": string,
        "@attr": {
          "nowplaying": string
        } | null | undefined,
        "date": {
          "uts": string,
          "#text": string
        } | null | undefined,
        "url": string
}

interface LastFMProps {
  cachedSongs: RecentTracks | null,
  setCachedSongs: React.Dispatch<React.SetStateAction<RecentTracks | null>>,
}

const LastFM: React.FC<LastFMProps> = ({ cachedSongs, setCachedSongs }) => {
  const [recentSongs, setRecentSongs] = useState<RecentTracks | null>(null);
  const [song, setSong] = useState<TrackInner | null>(null);
  const [scrobbles, setScrobbles] = useState<number>(0);
  const [date, setDate] = useState<string>("loading");
  const [rateLimit, setRateLimit] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("song");

  useEffect(() => {
    if (!cachedSongs)
      handleFetch();
    else
      setRecentSongs(cachedSongs);
  }, [])

  useEffect(() => {
    const recenttrack = recentSongs?.recenttracks.track[0];
    setSong(recenttrack || null);
    setScrobbles(Number(recentSongs?.recenttracks['@attr'].total) || 0);
    setDate(recenttrack?.['@attr']?.nowplaying ? "playing now" : recentSongs?.recenttracks.track[0].date?.['#text'] || "time not available (fatal error)")
    setCachedSongs(recentSongs);
  }, [recentSongs])

  useEffect(() => {
    setDate(song?.['@attr']?.nowplaying ? "playing now" : song?.date?.["#text"] || "time not available (fatal error)")
  }, [song])

  const handleFetch = () => {
    if (rateLimit) { 
      console.error("You are being rate limited.");
      return; 
    }
    setRateLimit(true);
    fetch('https://lastfm.nkko.workers.dev/?method=user.getRecentTracks&user=miniaturity')
      .then(res => res.json())
      .then(data => { console.log(data); setRecentSongs(data) })
      .catch(err => console.error("Failed to fetch song: ", err));
    const timeRateLimit = setTimeout(() => {
      setRateLimit(false);
    }, 10000);

    return () => clearTimeout(timeRateLimit);
  }

  const handleChangeViewmode = () => {
    setViewMode(prev => prev === "song" ? "list" : "song");
  }

  return (
    <div className="lastfm-contents">

      <div className="lc-main">
        {viewMode === "song" && <SongView scrobbles={scrobbles} song={song} date={date}/>}
        {viewMode === "list" && <ListView setViewMode={setViewMode} recenttracks={recentSongs} setSong={setSong} currentSong={song}/>}
      </div>

      <div className="lc-controls">
        <div className="lc-buttons">
          <button className={`lcc-reload${rateLimit ? '-disabled' : ''}`} onClick={handleFetch} disabled={rateLimit}>
            {'↻'}
          </button>

          <button className="lcc-viewmode" onClick={handleChangeViewmode}>
            {viewMode === "song" ? '♪' : viewMode === "list" ? '▤' : 'C'}
          </button>
        </div>

        <div className="lcc-api">
          {`[status: `}<span className="highlighted">{recentSongs ? "OK" : "NOT FOUND"}</span>{`]`}
        </div>

      </div>
    </div>
  )
}

interface ListViewProps {
  recenttracks: RecentTracks | null,
  setSong: React.Dispatch<React.SetStateAction<TrackInner | null>>,
  currentSong: TrackInner | null,
  setViewMode: React.Dispatch<React.SetStateAction<string>>,
}

const ListView: React.FC<ListViewProps> = ({ recenttracks, setSong, currentSong, setViewMode }) => {
  const [songsList, setSongsList] = useState<TrackInner[] | null>(null);

  useEffect(() => {
    if (!recenttracks) return;
    setSongsList(recenttracks.recenttracks.track);
  }, [recenttracks]);

  return (
    <div className="lf-list">
      {songsList?.map((song, index) => (
        <SongListItem setViewMode={setViewMode} song={song} unqKey={String(index)} currentSong={currentSong} setSong={setSong}/>
      ))}
    </div>
  )
}

interface SongListItemProps {
  song: TrackInner,
  currentSong: TrackInner | null,
  unqKey: string,
  setSong: React.Dispatch<React.SetStateAction<TrackInner | null>>,
  setViewMode: React.Dispatch<React.SetStateAction<string>>
}

const SongListItem: React.FC<SongListItemProps> = ({ song, unqKey, setSong, currentSong, setViewMode }) => {

  const handleClick = () => {
    if (song !== currentSong) {
      setSong(song);
    }
    setViewMode("song");
  }

  return (
    <div className="lfl-item" key={unqKey} onClick={handleClick}>
      <div className="lfli-img">
        <img src={song.image[0]["#text"]} alt="x"/>
      </div>    
      <div className="lfli-info">
        <div className="lfli-name">
          {song.name}
        </div>
        <div className="lfli-artist">
          {song.artist["#text"]}
        </div>
      </div>
    </div>
  )
}

interface SongViewProps {
  scrobbles: number,
  song: TrackInner | null,
  date: string,
}

const SongView: React.FC<SongViewProps> = ({ scrobbles, song, date}) => {

  const { number } = useSpring({
    from: { number: 0 },
    number: scrobbles,
    delay: 0,
    config: { 
      duration: 3000,
      easing: easings.easeOutExpo  
    }, 
  });

  return (
    <>
      <div className="lf-song">
          <div className="lfs-img">
            <img src={song?.image[3]["#text"] || "assets/coverart/luew.jpg"} alt={song?.name} id="lf-img-src"/>
          </div>

          <div className="lfs-info">
            <div className="lfsi-name">
              <a style={{ color: "var(--main-col)", fontWeight: "bold", textDecoration: "none" }} href={song?.url}>{song?.name || 'loading'}</a> 
            </div>
            <div className="lfsi-track">
              <div className="lfsi-album">
                on <span className="highlighted">{song?.album["#text"] || 'loading'}</span>
              </div>
              <div className="lfsi-artist">
              by <span className="highlighted">{song?.artist["#text"] || 'loading'}</span>
              </div>
              <div className="lfsi-date">
                {date === "playing now" ? "playing now!" : <>listened at <span className="highlighted">{date}</span></>}
              </div>
            </div>
          </div>
        </div>

        <div className="lf-dash">
          <div className="lfd-stats">
            <div className="lfds-scrobbles">
              <span className="highlighted" style={{ padding: "2px" }}>
                <animated.span>
                  {number.to((n) => `${Math.floor(n)}`)}
                </animated.span>
              </span>
              {" total scrobbles"}
            </div>
            <div className="lfds-user">
              <span className="highlighted" style={{ padding: "2px" }}>
                miniaturity
              </span>
              {" on last.fm"}
            </div>
          </div>
        </div>
      </>
  )
}

interface ToyBoxProps {
  setSelectedToy: React.Dispatch<React.SetStateAction<string>>,
  selectedToy: string, 
}

const ToyBox: React.FC<ToyBoxProps> = ({ setSelectedToy, selectedToy }) => {
  const toys = [
    "songs",
    "lastfm",
    "terminal"
  ]


  return (
    <div className={`toybox`}>
      {toys.map(toy => (
        <button className={`tb-button ${selectedToy === toy ? 'selected' : ''}`} onClick={() => {setSelectedToy(toy)}}>
          {toy}
        </button>
      ))}
    </div>
  )
}

interface CommandFunction {
  cmd: string,
  do: (args: string[] | null) => void,
}

interface Directory {
  name: string,
  files: File[] | null,
  dirs: Directory[] | null,
}

interface File {
  name: string,
  pwd: string | null,
  out: string,
  do: null | ((args: string[] | null) => void),
}

const Terminal: React.FC = () => {
  const [path, setPath] = useState<string>("C:/mini");
  const [currDir, setCurrDir] = useState<string>("mini");
  const [output, setOutput] = useState<string[]>(["Use the command 'help' for more information."]);
 
  /* Depth 3 Dirs */



  /* Depth 2 Dirs*/
  const aboutDir: Directory = {
    name: "about",
    files: [],
    dirs: null,
  }

  const songsDir: Directory = {
    name: "songs",
    files: [],
    dirs: null,
  }

  /* Depth 1 Dirs */
  const miniDir: Directory = {
    name: "mini",
    files: [],
    dirs: [aboutDir, songsDir]
  }

  const dirs = [
    miniDir,
    songsDir,
    aboutDir,
  ]

  const cmds: CommandFunction[] = [
    {
      cmd: "cd",
      do: function(args: string[] | null) {

      }
    }
  ]


  const execCommand = (cmd: string) => {
    const extracted: string[] = cmd.split(" ");
    const commandStr = extracted[0];
    const command = cmds.find(cmd => cmd.cmd === commandStr);

    if (!command) {
      openFile(commandStr, extracted[1] || null);
    } else {
      if (extracted.length === 1) command.do(null);
      else {
        command.do([...extracted.slice(1)]);
      }
    }
  }

  const openFile = (fileName: string, pwd: string | null) => {
    const currentDirectory = dirs.find(dir => dir.name === currDir);
    if (!currentDirectory) {
      setOutput(prev => [...prev, "Fatal error: Invalid Directory"])
      return;
    } 
    
    const requestedFile = currentDirectory.files?.find(file => file.name === fileName);
    
    if (!currentDirectory.files) {
      setOutput(prev => [...prev, "Invalid File or Command. Use the 'help' command for a list of the commands."]);
      return;
    } else if (!requestedFile) {
      setOutput(prev => [...prev, "Invalid File or Command. Use the 'help' command for a list of the commands."]);
      return;
    } else {
      if (requestedFile.pwd && requestedFile.pwd !== pwd) {
        setOutput(prev => [...prev, `Error: ${requestedFile.name} is locked behind a password.`]);
        return;
      }
      
      if (requestedFile.do)
        requestedFile.do(null);
      setOutput(prev => [...prev, requestedFile.out]);
    }

  }

  return (
    <div className="terminal-i">
      WIP ... will bween later.
    </div>
  )
}


interface Song {
  path: string,
  title: string,
  artist: string,
  albumart: string,
}

interface MP3PlayerProps {
  songs: Song[] 
}

const MP3Player: React.FC<MP3PlayerProps> = ({ songs }) => {
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



interface StatusBoxProps {
  statuses: Status[]
}

const StatusBox: React.FC<StatusBoxProps> = ({ statuses }) => {
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
