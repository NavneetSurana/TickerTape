# TickerTape

NSE and BSE Equity data collector and viewer.

# Work In Progress :construction_worker:

## Installation

-  Install [MongoDB](https://docs.mongodb.com/manual/installation/)
-  Install [yfinance 0.1.54](https://pypi.org/project/yfinance/) and all its dependencies.
-  Go to [server/](server/) directory and run **npm install**.
-  Go to [client/TickerTape/](client/TickerTape) directory and run **npm install**.
-  Go to [server/](server/) and make a new .env file and paste the following.

   ```
   DB_NAME_TT=tickerTapeTest
   DB_NAME_USER=userTest
   DB_USER=admin
   DB_PASSWORD=Insert_Your_ADMIN_USER_PASSWORD
   DB_HOST=localhost
   DB_PORT=27017
   DB_URL=mongodb://admin:[Insert_Your_ADMIN_USER_PASSWORD without braces]@localhost:27017
   DB_BACKUP_PATH=Give a directory path for DB backup
   AUTH_DB=admin
   SERVER_PORT=3000
   ```

-  Go to [server/] and create new directory **secret**
   -  cd into **secret**
   -  Create PEM encoded key-pair **tt_rsa** and **tt_rsa.pub**

## License

MIT License

Copyright (c) 2020 Navneet Surana

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## SHARING IS CARING

-  If you want to contribute, feel free to do so.
-  If there is any bug or issue please fix/report.
