"use client";

import { useEffect, useState } from "react";


interface Account {
  login:number;
  broker:string;
  server:string;
  balance:number;
  equity:number;
  floating_profit:number;
  connected:number;
}


export default function Home(){

  const [account,setAccount] = useState<Account | null>(null);


  useEffect(()=>{

    fetch("http://127.0.0.1:8787/api/accounts")
      .then(res=>res.json())
      .then(data=>{

        if(data.accounts?.length){
          setAccount(data.accounts[0]);
        }

      });


  },[]);



  if(!account){

    return (
      <main className="min-h-screen bg-black text-white p-8">
        Loading MT5 data...
      </main>
    );

  }



  return (

    <main className="min-h-screen bg-black text-white p-8">


      <h1 className="text-4xl font-bold mb-8">
        MT5 Monitor Pro
      </h1>



      <div className="grid gap-6 md:grid-cols-3">


        <Card
          title="Account"
          value={account.login}
        />


        <Card
          title="Broker"
          value={account.broker}
        />


        <Card
          title="Server"
          value={account.server}
        />


        <Card
          title="Balance"
          value={`$${account.balance}`}
        />


        <Card
          title="Equity"
          value={`$${account.equity}`}
        />


        <Card
          title="Floating Profit"
          value={`$${account.floating_profit}`}
        />


      </div>


    </main>

  );

}



function Card({
  title,
  value
}:{
  title:string;
  value:string|number;
}){

return (

<div className="rounded-xl border border-gray-700 p-6">

<p className="text-gray-400">
{title}
</p>

<h2 className="text-2xl font-bold mt-2">
{value}
</h2>


</div>

)

}