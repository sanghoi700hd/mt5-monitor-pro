//+------------------------------------------------------------------+
//| MT5 Monitor Pro EA v1.0                                         |
//| Send MT5 account data to Cloudflare Worker                       |
//+------------------------------------------------------------------+

#property strict

#include "config.mqh"


input int SendInterval = 30;


//------------------------------------------------
// Expert initialization
//------------------------------------------------

int OnInit()
{

   EventSetTimer(SendInterval);

   Print("MT5 Monitor Pro started");

   return(INIT_SUCCEEDED);
}


//------------------------------------------------
// Expert deinitialization
//------------------------------------------------

void OnDeinit(const int reason)
{

   EventKillTimer();

}


//------------------------------------------------
// Timer
//------------------------------------------------

void OnTimer()
{

   SendAccountData();

}


//------------------------------------------------
// Send account data
//------------------------------------------------

void SendAccountData()
{

   string json;


   json =
   "{"
   "\"login\":"+(string)AccountInfoInteger(ACCOUNT_LOGIN)+","
   "\"broker\":\""+AccountInfoString(ACCOUNT_COMPANY)+"\","
   "\"server\":\""+AccountInfoString(ACCOUNT_SERVER)+"\","
   "\"name\":\"MT5 Account\","
   "\"balance\":"+DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE),2)+","
   "\"equity\":"+DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY),2)+","
   "\"margin\":"+DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN),2)+","
   "\"free_margin\":"+DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_FREE),2)+","
   "\"margin_level\":"+DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_LEVEL),2)+","
   "\"leverage\":"+(string)AccountInfoInteger(ACCOUNT_LEVERAGE)+","
   "\"currency\":\""+AccountInfoString(ACCOUNT_CURRENCY)+"\","
   "\"floating_profit\":"+DoubleToString(AccountInfoDouble(ACCOUNT_PROFIT),2)
   "}";


   char post[];

   StringToCharArray(json,post);


   char result[];

   string headers;


   headers =
   "Content-Type: application/json\r\n"
   "Authorization: Bearer "+API_KEY+"\r\n";


   ResetLastError();


   int response =
   WebRequest(
      "POST",
      API_URL,
      headers,
      5000,
      post,
      result,
      headers
   );


   if(response == -1)
   {

      Print(
      "WebRequest failed: ",
      GetLastError()
      );

      return;

   }


   string answer =
   CharArrayToString(result);


   Print(
   "Server response: ",
   answer
   );


}