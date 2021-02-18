import React, {useState} from "react";


const Propose = ({doPropose, defaultTarget}) => {
    const [amount, setAmount] = useState(100);
    const [to, setTo] = useState(defaultTarget);

    //useEffect(()=>{
    //    setTo(defaultTarget);
    //}, [defaultTarget])

    return (
       <form onSubmit={ e => {
           e.preventDefault();
           doPropose({amount, to});
       }}>
           <label>amount
                <input type="text" name="amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
           </label>
           <label>to
                <input type="text" name="to" value={to} onChange={e=>setTo(e.target.value)}/>
           </label>
           <input type="submit" text="Propose" />
       </form>
    )
}

export default Propose;
