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


  async function fetchData(){

    try{

      const res = await fetch(
        "http://127.0.0.1:8787/api/accounts"
      );

      const data = await res.json();


      if(data.accounts && data.accounts.length > 0){

        setAccount(data.accounts[0]);

      }


    }catch(error){

      console.log(error);

    }

  }



  // Auto Refresh realtime 3 giây

  useEffect(()=>{

    fetchData();


    const timer = setInterval(()=>{

      fetchData();

    },3000);



    return ()=>clearInterval(timer);


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



{/* ACCOUNT + ONLINE STATUS */}

<div className="rounded-xl border border-gray-700 p-6">


<p className="text-gray-400">
Account
</p>


<h2 className="text-3xl font-bold mt-2">
{account.login}
</h2>



{
account.connected === 1 ?

(

<div className="flex items-center gap-2 mt-4">

<span className="h-3 w-3 rounded-full bg-green-500"></span>

<span className="text-green-400">
Online
</span>

</div>

)

:

(

<div className="flex items-center gap-2 mt-4">

<span className="h-3 w-3 rounded-full bg-red-500"></span>

<span className="text-red-400">
Offline
</span>

</div>

)

}



</div>




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
value={`$${account.balance.toFixed(2)}`}
/>



<Card
title="Equity"
value={`$${account.equity.toFixed(2)}`}
/>



<Card
title="Floating Profit"
value={`$${account.floating_profit.toFixed(2)}`}
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