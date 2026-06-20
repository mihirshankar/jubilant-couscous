import Image from "next/image";
import Link from "next/link";

import { Fragment } from "react/jsx-runtime";
import HeaderBar from "./component/headerbar";
import BottomBar from "./component/bottombar";


export default function Home() {

  return (
    <main >
      
        
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="background.mp4" type="video/mp4" />
          
        </video>

        <div className="video-dark-overlay" />

        <div className="text-overlay">
          Welcome to Mihir&apos;s Portfolio!
        </div>


      <div className="fixed-bottom">
        <BottomBar />
      </div>
    </main>
  );
}
