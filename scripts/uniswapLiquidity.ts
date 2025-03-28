import { ethers } from "hardhat";
import { expect } from "chai";
const { Table } = require('console-table-printer');

//Create a table
const p = new Table();

(async () => {
    const [owner] = await ethers.getSigners();
    let tokenA: any;
    let tokenB: any;
    let weth: any;
    let factory: any;
    let router: any;
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    tokenA = await ERC20Mock.deploy("TokenA", "TKA", ethers.parseEther("100000"));
    tokenB = await ERC20Mock.deploy("TokenB", "TKB", ethers.parseEther("100000"));

    // Deploy WETH
    const WETH = await ethers.getContractFactory("WETH");
    weth = await WETH.deploy();

    // Deploy Factory
    const Factory = (await ethers.getContractFactory("UniswapV2Factory"));
    factory = await Factory.deploy(owner.address);

    // Deploy Router
    const Router = await ethers.getContractFactory("UniswapV2Router02Wrap");
    router = await Router.deploy(await factory.getAddress(), await weth.getAddress());

    // Apporve Token to Router 
    await tokenA.approve(await router.getAddress(), ethers.MaxUint256);
    await tokenB.approve(await router.getAddress(), ethers.MaxUint256);

    const amountADesired = ethers.parseUnits("10000", 0);
    const amountBDesired = ethers.parseUnits("10000", 0);
    const amountAMin = amountADesired;
    const amountBMin = amountBDesired;
    const deadline = Math.floor(Date.now()) + 60 * 1000;

    const addRow = async (index: number, lable: string) => {
        p.addRow({ Round: index, Lable: lable, TokenX: await tokenA.balanceOf(pairAddress), TokenY: await tokenA.balanceOf(pairAddress), LiquidityBalance: await pair.balanceOf(owner.address) });
    };

    //addLiquidity
    await router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        owner.address,
        deadline
    );
    const pairAddress = await factory.getPair(await tokenA.getAddress(), await tokenB.getAddress());
    const pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);
    /**
     * round 1
     */
    await addRow(1, "Add Liquidity");

    //addLiquidity
    await router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        owner.address,
        deadline
    );
    await addRow(2, "Add Liquidity");


    const liquidityBalance = await pair.balanceOf(owner.address);
    await pair.approve(await router.getAddress(), liquidityBalance);
    await router.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        liquidityBalance,
        0,
        0,
        owner.address,
        deadline
    );
    await addRow(3, "Remove Liquidity");

    p.printTable();

})();
