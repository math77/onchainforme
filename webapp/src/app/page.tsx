"use client";

import { useState, useEffect } from "react";

import { parseEther, stringToBytes } from "viem";

import Modal from "react-modal";
import { CirclePicker } from 'react-color';


import WalletButton from "@/components/WalletButton";
import SvgComponent from "@/components/SvgComponent";
import Pending from "@/components/Pending";
import Header from "@/components/Header";

import { 
  useAccount,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  usePrepareContractWrite 
} from 'wagmi';

import { abi } from "../contract-abi";

const contractAddress = "0x87709D347C13a7FF375FAAf224fF1344b776dd92";

const contractConfig = {
  address: contractAddress,
  abi
} as const;


export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [totalMinted, setTotalMinted] = useState<number>(0);
  const [color, setColor] = useState<string>("#0a56ff");
  const [colorID, setColorID] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  
  const { isConnected } = useAccount();

  const defaultMsg = "Your message will appear here.";

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: statsData } = useContractRead({
    ...contractConfig,
    functionName: 'stats',
    watch: true,
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'mint',
    value: parseEther('0.007'),
    args: [BigInt(colorID), `0x${Buffer.from(stringToBytes(message!)).toString('hex')}`],
    enabled: Boolean(message!)
  });

  const {
    data: mintData,
    write: mint,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const {
    data: txData,
    isLoading: txLoading,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess(data) {
      setIsModalOpen(true);
    },
  });

  useEffect(() => {
    if (statsData) {
      setTotalMinted(Number(statsData[0]));
    }
  }, [statsData]);


  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleColor = (color: any) => {
    setColor(color.hex);

    switch(color.hex) {
      case "#ffd600":
        setColorID(0);
        break;
      case "#06d6a0":
        setColorID(1);
        break;
      case "#ef476f":
        setColorID(2);
        break;
      case "#cdecee":
        setColorID(3);
        break;
      case "#f91212":
        setColorID(4);
        break;
      case "#0a56ff":
        setColorID(5);
        break;
    }

  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  const renderMintModal = () => {
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
            <p className="text-5xl mb-6 font-semibold">You got this!</p>
            <div>
              View on {' '}
              <a 
                  className="text-blue-500 mt-4"
                href={`https://testnets.opensea.io/assets/base-goerli/${contractAddress}/${Number(totalMinted)}`}
                target="_blank"
              >
                OpenSea
              </a>
            </div>
            <div className="mt-4">
              View on {' '}
              <a
                className="text-blue-500" 
                href={`https://etherscan.io/tx/${txData?.transactionHash}`}
                target="_blank"
              >
                Etherscan
              </a>
            </div>
            <button 
              onClick={closeModal} 
              className="bg-black text-white font-semibold px-4 py-2 rounded-full mt-12"
            >
              Make other message
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <main className="h-screen bg-black">
      <Header />
      <h1 className="mt-4 text-1xl text-center text-white font-semibold">{totalMinted} minted so far</h1>
      <div className="flex justify-center items-center mt-3 bg-black">
        {message == '' ?
          <SvgComponent message={defaultMsg} color={color} highlight={false} />

          : <SvgComponent message={message} color={color} highlight={true} />
        }

      </div>      
      <div className="flex justify-center items-center mt-3 bg-black">
        <div className="w-2/5 bg-black">
          <textarea onChange={handleChange} value={message} id="message" name="message" rows={4} className="block p-2.5 w-full mt-5 mb-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="What onchain means for you?"></textarea>
          
          <div className="flex justify-center items-center mt-4 bg-black">
            <CirclePicker 
              color={color}
              colors={[
                "#ffd600",
                "#06d6a0",
                "#ef476f",
                "#cdecee",
                "#f91212",
                "#0a56ff"
              ]}
              onChangeComplete={handleColor}
            />
          </div>

          <div className="flex justify-center items-center mt-4 mb-3 bg-black">
            {mounted && !isConnected && (
              <WalletButton />
            )}

            {mounted && isConnected && (
              <button 
                disabled={txLoading || !mint}
                onClick={() => mint?.()} 
                className="mr-4 bg-slate-900 text-white font-semibold px-4 py-2 rounded-full disabled:bg-slate-500 focus:outline-none hover:bg-black focus:ring-4 focus:ring-gray-200"
              >

                {!txLoading ? 'Mint 0.007 ETH' : <Pending className="animate-spin" />}
              </button>
            )}
          </div>
        </div>
      </div>
      {renderMintModal()}
    </main>
  )
}
