import { ethers } from "hardhat";
import { expect } from "chai";
import { BaseContract } from "ethers";
import { UniswapV2Factory } from "../typechain-types";

describe("UniswapV2 Liquidity Test", function () {
    let tokenA: any;
    let tokenB: any;
    let weth: any;
    let factory: any;
    let router: any;
    let owner: any;

    before(async function () {
        [owner] = await ethers.getSigners();

        // 部署测试代币 ERC20 Token A 和 Token B
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        tokenA = await ERC20Mock.deploy("TokenA", "TKA", ethers.parseEther("100000"));
        tokenB = await ERC20Mock.deploy("TokenB", "TKB", ethers.parseEther("100000"));

        // 部署WETH合约
        const WETH = await ethers.getContractFactory("WETH");
        weth = await WETH.deploy();

        // 部署Factory
        const Factory = (await ethers.getContractFactory("UniswapV2Factory"));
        factory = await Factory.deploy(owner.address);

        // 部署Router
        const Router = await ethers.getContractFactory("UniswapV2Router02Wrap");
        router = await Router.deploy(await factory.getAddress(), await weth.getAddress());

        // 授权Router使用Token
        await tokenA.approve(await router.getAddress(), ethers.MaxUint256);
        await tokenB.approve(await router.getAddress(), ethers.MaxUint256);
    });

    it("should add and remove liquidity correctly", async function () {
        const amountADesired = ethers.parseEther("1000");
        const amountBDesired = ethers.parseEther("1000");
        const amountAMin = amountADesired;
        const amountBMin = amountBDesired;
        const deadline = Math.floor(Date.now()) + 60 * 1000;

        // 添加流动性
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
        expect(pairAddress).to.not.equal(ethers.ZeroAddress);
        const pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);
        const liquidityBalance = await pair.balanceOf(owner.address);
        expect(liquidityBalance).to.be.gt(0);

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

        // 验证流动性移除完毕
        const liquidityBalanceAfter = await pair.balanceOf(owner.address);
        expect(liquidityBalanceAfter).to.equal(0);
    });
});