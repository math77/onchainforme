import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


const SVG_START = '<svg width="750" height="950" viewBox="0 0 750 950" fill="none" xmlns="http://www.w3.org/2000/svg"><style>text{fill:#000;font-family:sans-serif;font-size:50px;font-weight:800}</style><path fill="#fff" d="M0 0h750v950H0z"/><path fill="#';
const SVG_MIDDLE = '" d="M0 0h750v598H0z"/><path fill="#fff" d="M335 259h80v80h-80zm40-82-17.321 30h34.642L375 177Zm3 68.117V204h-6v41.117h6Zm-3 176.001 17.321-30h-34.642l17.321 30ZM372 353v41.118h6V353h-6Zm121.118-54-30-17.321v34.642l30-17.321ZM425 302h41.118v-6H425v6Zm-168-3 30 17.321v-34.642L257 299Zm68.117-3H284v6h41.117v-6ZM98.5 31l53.5 97.5L98.5 226 45 128.5 98.5 31Z"/><path d="M642.5 475c0 52.743-42.757 95.5-95.5 95.5s-95.5-42.757-95.5-95.5 42.757-95.5 95.5-95.5 95.5 42.757 95.5 95.5Z" stroke="#fff" stroke-width="9"/><path d="M732.5 475c0 52.743-42.757 95.5-95.5 95.5s-95.5-42.757-95.5-95.5 42.757-95.5 95.5-95.5 95.5 42.757 95.5 95.5Z" stroke="#fff" stroke-width="9"/><circle cx="136" cy="475" r="98.5" stroke="#fff" stroke-width="3"/><path d="M184.5 475c0 27.432-5.563 52.193-14.486 70.04-8.969 17.937-21.081 28.46-34.014 28.46-12.933 0-25.045-10.523-34.014-28.46C93.063 527.193 87.5 502.432 87.5 475c0-27.432 5.563-52.193 14.486-70.04 8.969-17.937 21.081-28.46 34.014-28.46 12.933 0 25.045 10.523 34.014 28.46 8.923 17.847 14.486 42.608 14.486 70.04Z" stroke="#fff" stroke-width="3"/><path d="M136 426.5c27.432 0 52.193 5.563 70.04 14.486 17.937 8.969 28.46 21.081 28.46 34.014 0 12.933-10.523 25.045-28.46 34.014-17.847 8.923-42.608 14.486-70.04 14.486-27.432 0-52.193-5.563-70.04-14.486C48.023 500.045 37.5 487.933 37.5 475c0-12.933 10.523-25.045 28.46-34.014C83.807 432.063 108.568 426.5 136 426.5Z" stroke="#fff" stroke-width="3"/><path d="M220.5 475c0 24.647-5.553 46.886-14.456 62.911C197.113 553.987 185.015 563.5 172 563.5c-13.015 0-25.113-9.513-34.044-25.589C129.053 521.886 123.5 499.647 123.5 475s5.553-46.886 14.456-62.911C146.887 396.013 158.985 386.5 172 386.5c13.015 0 25.113 9.513 34.044 25.589C214.947 428.114 220.5 450.353 220.5 475Z" stroke="#fff" stroke-width="3"/><path d="M150.5 475c0 24.647-5.553 46.886-14.456 62.911C127.113 553.987 115.015 563.5 102 563.5c-13.015 0-25.113-9.513-34.044-25.589C59.053 521.886 53.5 499.647 53.5 475s5.553-46.886 14.456-62.911C76.886 396.013 88.985 386.5 102 386.5c13.015 0 25.113 9.513 34.044 25.589C144.947 428.114 150.5 450.353 150.5 475Z" stroke="#fff" stroke-width="3"/><path stroke="#fff" stroke-width="2" d="M602 93h118v118H602z"/><path stroke="#fff" stroke-width="2" d="M667 160h48v48h-48z"/><path stroke="#fff" stroke-width="2" d="M578 69h148v148H578z"/><path stroke="#fff" stroke-width="2" d="M535 27h198v198H535z"/><path d="M678 207c-1.37-20.043-9.295-38.389-4.958-58.836 1.173-5.531 1.188-10.545-.11-16.119-1.4-6.015-7.932-14.635-7.932-20.149 0-1.304 4.671-3.16 2.093-4.836-2.091-1.36-.991-6.151-.991-8.06" stroke="#06D6A0" stroke-width="3" stroke-linecap="round"/><path d="m626.679 62.956 28.681 14.05-8.854-30.686 17.814 26.507 7.674-31.001 2.174 31.863 22.147-23.011-14.048 28.681 30.685-8.855-26.507 17.815 31.001 7.674-31.863 2.174 23.011 22.147-28.681-14.049 8.854 30.686-17.814-26.508-7.674 31.002-2.175-31.863-22.146 23.011 14.048-28.682-30.685 8.855 26.507-17.814-31.001-7.674 31.863-2.175-23.011-22.146Z" fill="#fff"/><path d="m664.928 72.853 1.371 3.095 1.371-3.094 9.709-21.905-2.545 23.824-.359 3.365 2.734-1.994 19.36-14.115-14.115 19.36-1.994 2.734 3.365-.36 23.824-2.544-21.904 9.709-3.095 1.37 3.095 1.372 21.904 9.708-23.824-2.544-3.365-.359 1.994 2.734 14.115 19.36-19.36-14.116-2.734-1.993.359 3.365 2.545 23.824-9.709-21.905-1.371-3.094-1.371 3.094-9.709 21.905 2.545-23.824.359-3.365-2.734 1.993-19.36 14.116 14.116-19.36 1.993-2.734-3.365.359-23.824 2.544 21.905-9.708 3.094-1.371-3.094-1.372-21.905-9.708 23.824 2.545 3.365.36-1.993-2.735-14.116-19.36 19.36 14.115 2.734 1.994-.359-3.365-2.545-23.824 9.709 21.904Z" fill="#fff" fill-opacity=".8" stroke="#fff" stroke-width="3"/><circle cx="667.5" cy="91.5" r="17" fill="#FFD600" stroke="#FBF7F3"/><path d="m285.197 57.66.504 2.717 2.004-1.902 24.664-23.403-14.637 30.689-1.189 2.493 2.739-.36 33.71-4.437-29.88 16.225L300.684 81l2.428 1.318 29.88 16.225-33.71-4.437-2.739-.36 1.189 2.493 14.637 30.689-24.664-23.403-2.004-1.902-.504 2.716L279 137.77l-6.197-33.431-.504-2.716-2.004 1.902-24.664 23.403 14.637-30.689 1.189-2.493-2.739.36-33.71 4.437 29.88-16.225L257.316 81l-2.428-1.318-29.88-16.225 33.71 4.437 2.739.36-1.189-2.493-14.637-30.69 24.664 23.404 2.004 1.902.504-2.716L279 24.23l6.197 33.43Z" stroke="#fff" stroke-width="3"/><circle cx="455" cy="74" r="28.5" stroke="#fff" stroke-width="3"/><circle cx="455" cy="76" r="5" fill="#fff"/><path d="m356 485 8.981 27.639h29.061l-23.511 17.082 8.98 27.64L356 540.279l-23.511 17.082 8.98-27.64-23.511-17.082h29.061L356 485Z" fill="#fff"/><path d="M630.896 314.922c.725-.406 76.358-54.379 79.889-18.778 1.519 15.321-14.326 21.738-26.112 21.555-15.519-.24-32.132-11.718-46.222-16.111-4.93-1.537-10.284-3.308-15.333-2.222-9.336 2.008-.075 13.213 1.333 14.222 9.598 6.876 17.168.531 24.445-4.666M284.5 172.875c-18.09 11.535-34.929 27.309-47.843 44.061-10.557 13.695-9.011 21.929 2.594 33.53 10.247 10.243 33.698 29.758 50.293 21.753 10.407-5.02 7.293-18.804 2.449-25.494-17.65-24.378-51.218-28.823-75.655-43.575-10.115-6.107-22.419-13.35-11.744-25.425 6.007-6.796 18.19-10.278 26.731-5.543 14.149 7.845 8.228 37.718 6.845 49.811-1.982 17.339-5.894 33.953-16.788 48.287-9.631 12.671-23.372 19.578-36.747 27.849-5.51 3.408-41.343 26.928-30.262 36.856 9.041 8.099 31.58 2.625 39.125-4.78 15.21-14.929-1.188-38.935-11.961-51.474-8.52-9.916-20.4-16.394-29.325-26.048" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="m142.42 243.89 18.283 6.889-11.119 10.691-7.164-17.58Z" fill="#fff"/><circle cx="62" cy="301" r="39" stroke="#fff" stroke-width="2"/><ellipse cx="57" cy="301" rx="35" ry="40" fill="#fff"/><path stroke="#fff" stroke-width="3" d="M527.5 280.5h57v57h-57z"/><path fill="#fff" d="M553 279h30v60h-30z"/><path stroke="#fff" stroke-width="5" d="M433 182.5h80M470.509 210v-50m-29.268 51.803 56.569-56.569m-53.033-.002 56.568 56.569"/><path d="M264.957 433.5 297 378l32.043 55.5h-64.086Z" stroke="#fff" stroke-width="3"/><path stroke="#fff" stroke-width="5" d="M263.996 397h66.008"/><text x="25" y="700">ONCHAIN</text><text x="25" y="780">FOR</text><text x="185" y="830">ME</text><foreignObject x="395" y="700" width="320" height="240"><div xmlns="http://www.w3.org/1999/xhtml"><p style="color:#000;font-family:sans-serif;font-size:1.3em;font-weight:540;text-align:justify;text-justify:inter-word;margin:10px auto;white-space:pre-wrap">';

const convert = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

describe("All", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPostersFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2] = await ethers.getSigners();

    const convertedStr = convert(SVG_START);
    const convertedStr2 = convert(SVG_MIDDLE);

    const assetStoreContract = await ethers.getContractFactory("AssetStore");
    const assetStore = await assetStoreContract.deploy();

    const saveConverted1Txn = await assetStore.connect(owner).saveAsset(convertedStr);
    const saveConverted2Txn = await assetStore.connect(owner).saveAsset(convertedStr2);

    const svgStartAddr = await assetStore.assetAddress(ethers.keccak256(convertedStr));
    const svgMiddleAddr = await assetStore.assetAddress(ethers.keccak256(convertedStr2));


    const postersContract = await ethers.getContractFactory("OnchainForMe");
    const posters = await postersContract.deploy(svgStartAddr, svgMiddleAddr);


    return { posters, assetStore, owner, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should mint one token to account1", async function () {

      const { posters, owner, account1 } = await loadFixture(deployPostersFixture);

      const message = "Onchain is the new online. A window for creativity, imagination, community and fun. Everything can be build for anyone. Fork, remix, rethink, rebuild and ship. Have fun, change the world, take care of yourself.";

      const messageParam = convert(message);

      await expect(posters.connect(account1).mint(0, messageParam, {value: ethers.parseEther("0.007")})).to.emit(posters, "Minted").withArgs(1);

      const uri = await posters.tokenURI(1);
      const last = await posters.stats();

      console.log("URI: ", uri);
      console.log("STATS: ", last);
    });

    it("Should revert with not withdraw", async function () {
      const { posters, account1 } = await loadFixture(deployPostersFixture);

      await expect(posters.connect(account1).withdrawBalance()).to.be.reverted;
    });

    it("Should not revert withdraw", async function () {
      const { posters, owner, account1 } = await loadFixture(deployPostersFixture);

      await expect(posters.connect(owner).withdrawBalance()).not.to.be.reverted;
    });

  });

});