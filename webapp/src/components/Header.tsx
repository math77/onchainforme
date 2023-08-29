"use client";

import { useState } from "react";

import WalletButton from "./WalletButton";
import Modal from "react-modal";

const Header = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderAboutModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      > 
        <div className="flex justify-center items-center">
          <div className="grid justify-items-center">
            <h1 className="text-3xl mb-3 font-semibold text-black">Onchain For Me...</h1>
            <p className="text-base mt-2 font-medium text-black">
              Share a statement (onchain) of what onchain means to you by minting 
              an NFT. What does this new chapter, this new narrative, and 
              creative direction mean, and what do you hope for the future 
              of all the communities, projects, companies, and people 
              building here together now.
            </p>
            <button
              onClick={closeModal}
              className="bg-black font-bold lg:font-bold text-white px-6 py-2 mt-4 rounded-full"
            >
              ok
            </button>
          </div>
        </div>
      </Modal>
    );
  } 

  return (
    <div className="flex justify-between items-center p-4 bg-black">
      <div className="flex gap-2">
        <h1 className="font-bold lg:font-bold text-white">ONCHAIN FOR ME</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black font-bold lg:font-medium text-white ml-2"
        >
          About
        </button>
      </div>
      <div className="flex items-center gap-8">
        <WalletButton />
      </div>
      {renderAboutModal()}
    </div>
  );
};

export default Header;