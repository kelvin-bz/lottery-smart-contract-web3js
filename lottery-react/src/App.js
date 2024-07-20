import React, { useState, useEffect } from "react";
import web3 from "./web3";
import lottery from "./lottery";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";  // Import the CSS file

function App() {
    const [manager, setManager] = useState("");
    const [players, setPlayers] = useState([]);
    const [balance, setBalance] = useState("");
    const [value, setValue] = useState("");
    const [message, setMessage] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");

    useEffect(() => {
        async function fetchData() {
            const manager = await lottery.methods.manager().call();
            const players = await lottery.methods.getPlayers().call();
            const balance = await web3.eth.getBalance(lottery.options.address);
            const currentAccounts = await web3.eth.getAccounts();
            setManager(manager);
            setPlayers(players);
            setBalance(balance);
            setCurrentAccount(currentAccounts[0]);
        }

        fetchData();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        setMessage("Waiting on transaction success...");

        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei(value, "ether"),
            });
            setMessage("You have been entered!");
            toast.success("You have been entered!");
        } catch (error) {
            setMessage("Transaction failed.");
            toast.error("Transaction rejected. Please try again.");
        }
    }

    async function handleClick() {
        const accounts = await web3.eth.getAccounts();

        setMessage("Waiting on transaction success...");

        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0],
            });
            setMessage("A winner has been picked!");
            toast.success("A winner has been picked!");
        } catch (error) {
            setMessage("Transaction failed.");
            toast.error("Transaction rejected. Please try again.");
        }
    }

    return (
        <div className="container">
            <ToastContainer />
            <h2>Lottery Contract</h2>
            <p>
                You are currently signed in as {currentAccount}. <br />
                This contract is managed by {manager}. There are currently{" "}
                {players.length} people entered, competing to win{" "}
                {web3.utils.fromWei(balance, "ether")} ether!
            </p>

            <hr />
            <form onSubmit={handleSubmit}>
                <h4>Want to try your luck?</h4>
                <div>
                    <label>Amount of ether to enter</label>
                    <input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </div>
                <button>Enter</button>
            </form>


            {currentAccount.toLowerCase() === manager.toLowerCase() && (
                <div>
                    <h4>Ready to pick a winner?</h4>
                    <button onClick={handleClick}>Pick a winner!</button>
                    <hr />
                </div>
            )}

            <h1>{message}</h1>
        </div>
    );
}

export default App;
