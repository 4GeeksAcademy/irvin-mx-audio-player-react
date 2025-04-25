import React, { useEffect, useState, useRef } from "react";

// Create your first component
const Home = () => {
    const [tracksFromApiArray, setTracksFromApiArray] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(null); // Track the index of the currently playing song
    const [isSongPlaying, setIsSongPlaying] = useState(false);

    const audioTagSrc = useRef(null);

    const getAllSongs = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/sound/songs");
            if (!response.ok) {
                throw new Error("There was an error in getting all songs.");
            }
            const data = await response.json();
            setTracksFromApiArray([...data.songs]);
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch songs before the component loads
    useEffect(() => {
        getAllSongs();
    }, []);

    const handleSong = (e) => {
        const selectedSongIndex = parseInt(e.target.id);
        setCurrentSongIndex(selectedSongIndex); 

        if (audioTagSrc.current) {
            audioTagSrc.current.src = `https://playground.4geeks.com${e.target.dataset.songurl}`;
            audioTagSrc.current.play();
            setIsSongPlaying(true);
        }
    };

    const handlePause = () => {
        if (audioTagSrc.current) {
            audioTagSrc.current.pause();
        }
        setIsSongPlaying(false);
    };

    const handlePlay = () => {
        if (audioTagSrc.current) {
            audioTagSrc.current.play();
        }
        setIsSongPlaying(true);
    };

    const handlePreviousSong = () => {
        let newIndex = currentSongIndex;

        if (newIndex === null || newIndex <= 0) {
            // If already at the first song or undefined, play the first song
            newIndex = 0;
        } else {
            // Move to the previous song
            newIndex -= 1;
        }

        setCurrentSongIndex(newIndex); // Update the current song index

        if (audioTagSrc.current) {
            audioTagSrc.current.src = `https://playground.4geeks.com${tracksFromApiArray[newIndex].url}`;
            audioTagSrc.current.play();
            setIsSongPlaying(true);
        }
    };

    const handleNextSong = () => {
        let newIndex = currentSongIndex;

        if (newIndex === null || newIndex >= tracksFromApiArray.length - 1) {

            newIndex = 0;
        } else {
            newIndex += 1;
        }

        setCurrentSongIndex(newIndex); 

        if (audioTagSrc.current) {
            audioTagSrc.current.src = `https://playground.4geeks.com${tracksFromApiArray[newIndex].url}`;
            audioTagSrc.current.play();
            setIsSongPlaying(true);
        }
    };

    return (
        <div className="h-100">
            <ul className="list-group bg-dark text-light pb-5">
                {tracksFromApiArray.length > 0 ? (
                    tracksFromApiArray.map((item, index) => (
                        <button
                            onClick={(e) => handleSong(e)}
                            id={index}
                            data-songurl={item.url}
                            className="d-flex border align-items-center btn btn-dark"
                            key={item.id}
                        >
                                {item.id}{"-"}{item.name}
                        
                        </button>
                    ))
                ) : (
                    <p>0 tracks available</p>
                )}
            </ul>

            <div className="position-fixed bottom-0 bg-secondary w-100 d-flex justify-content-center">
                <audio ref={audioTagSrc}></audio>

                
                <button onClick={handlePreviousSong} className="btn btn-primary mx-3">
                    <i className="fa-solid fa-backward-step"></i>
                </button>
                {isSongPlaying ? (
                    <button onClick={handlePause} className="btn btn-primary mx-3">
                        <i className="fa-solid fa-pause text-secondary"></i>
                    </button>
                ) : (
                    <button onClick={handlePlay} className="btn btn-primary">
                        <i className="fa-solid fa-play"></i>
                    </button>
                )}
                <button onClick={handleNextSong} className="btn btn-primary mx-3">
                    <i className="fa-solid fa-forward-step"></i>
                </button>
            </div>
        </div>
    );
};

export default Home;