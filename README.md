# Uniswap V2 Playgound

This project is a playground based on Uniswap V2, you can try follow command get detail trade detail

## Environment

- Node: v20.0.0
- Pnpm: 9.15.0

## How to running project?

```shell
pnpm i
```

## Simulate liquidity

```shell
pnpm hardhat run scripts/uniswapLiquidity.ts

┌───────┬──────────────────┬────────┬────────┬──────────────────┐
│ Round │            Lable │ TokenX │ TokenY │ LiquidityBalance │
├───────┼──────────────────┼────────┼────────┼──────────────────┤
│     1 │    Add Liquidity │  10000 │  10000 │             9000 │
│     2 │    Add Liquidity │  20000 │  20000 │            19000 │
│     3 │ Remove Liquidity │   1000 │   1000 │                0 │
└───────┴──────────────────┴────────┴────────┴──────────────────┘
```

#### What this project can do？

1.  Can quickly simulate swap of uniswapV2 on locally.
2.  Can quickly simulate add liquidity of uniswapV2 on locally.
3.  Can quickly simulate remove liquidity of uniswapV2 on locally.
