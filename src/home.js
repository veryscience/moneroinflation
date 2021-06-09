import React, { Component } from 'react'
import axios from 'axios'
import QRCode from "react-qr-code";
import logo from "./monero.png"
import bitcoinLogo from "./bitcoinLogo.png"
import dogeLogo from "./Dogecoin_logo.png"
import Button from '@material-ui/core/Button'

export class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            circulation: 100000000,
            price: 0,
            marketCap: 0,
            rank: 1,
            reward: 3,
            bitcoinInflation: 1,
            dogeInflation: 1
        }
    }

    async componentDidMount() {

        //monero info
        let result = await axios.get("https://api.coingecko.com/api/v3/coins/monero?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true")
        let blockInfo = await axios.get("https://localmonero.co/blocks/api/get_stats")

        let lastReward = blockInfo.data.last_reward
        lastReward = lastReward.toString()
        //lastReward = lastReward[0] + '.' + lastReward.slice(1)
        lastReward = '0.' + lastReward
        lastReward = Number(lastReward)
        lastReward *= 262800
        lastReward = lastReward.toFixed(3)

        let data = result.data.market_data

        //bitcoin info
        let bitcoinResult = await axios.get("https://api.coingecko.com/api/v3/coins/bitcoin?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true")
        let bitcoinBlockInfo = await axios.get("https://blockchain.info/q/bcperblock")

        let bitcoinLastReward = bitcoinBlockInfo.data
        bitcoinLastReward *= 52560
        bitcoinLastReward = bitcoinLastReward.toFixed(2)

        let bitcoinData = bitcoinResult.data.market_data

        let bitcoinInflation = bitcoinLastReward / bitcoinData.circulating_supply
        bitcoinInflation = 100 * bitcoinInflation

        //doge info
        let dogeResult = await axios.get("https://api.coingecko.com/api/v3/coins/dogecoin?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true")
        let dogeData = dogeResult.data.market_data

        let dogeInflation = dogeData.circulating_supply / 5000000000
        dogeInflation = 100 / dogeInflation


        this.setState({
            circulation: data.circulating_supply,
            price: data.current_price.usd,
            marketCap: data.market_cap.usd,
            rank: data.market_cap_rank,
            reward: lastReward,
            bitcoinInflation: bitcoinInflation,
            dogeInflation: dogeInflation
        })

    }

    render() {
        let inflation = this.state.reward / this.state.circulation
        inflation = 100 * inflation

        return (
            <div align="center">
                <div>
                    <img src={logo} height="20%" width="20%" />
                </div>
                <div id="textInfo">
                    <h2>Price : ${this.state.price.toFixed(2)}</h2>
                    <h2>Inflation Rate: {inflation.toFixed(2)}%</h2>
                    <h2>
                        Market Cap: ${this.state.marketCap
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </h2>
                    <h2>market Cap Rank: {this.state.rank}</h2>
                    <br />
                    <div align="center">
                        <h2>Tips Appreciated :)</h2>
                        <QRCode value="42wM142JiX12Bbn4QGLLFyGAYNJoMJxwALG3NvPzpzwG8tvE22uiCQqHf58EfmT6VoA6kwQoCPkXj63oC9CrD1bBFCy99Qu" size="128" />
                        <br></br>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigator.clipboard.writeText('42wM142JiX12Bbn4QGLLFyGAYNJoMJxwALG3NvPzpzwG8tvE22uiCQqHf58EfmT6VoA6kwQoCPkXj63oC9CrD1bBFCy99Qu')}
                        >
                            Copy
                        </Button>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <h3>Other Coins</h3>
                <div id="bitcoin">
                    <a href="https://veryscience.github.io/bitcoininflation/" >
                        <img src={bitcoinLogo} height="14%" width="14%" />
                        <br />
                        <p>Inflation: {this.state.bitcoinInflation.toFixed(2)}%</p>
                    </a>
                </div>
                <br />
                <div id="doge">
                    <a href="https://veryscience.github.io/dogeinflation/" >
                        <img src={dogeLogo} height="14%" width="14%" />
                        <br />
                        <p>Inflation: {this.state.dogeInflation.toFixed(2)}%</p>
                    </a>
                </div>
            </div>
        )
    }
}

export default Home
