import sys
import pymongo
from pandas_datareader import data as pdr
import datetime

import yfinance as yf
yf.pdr_override()


def flushAll():
    sys.stdout.flush()
    sys.stderr.flush()
    sys.stdin.flush()


def getColName(Symbol):
    extension = Symbol[-2:]
    collection = Symbol[:-3]
    if extension == 'BO':
        collection += '.BSE'
    if extension == 'NS':
        collection += '.NSE'
    return collection


def fetchHistory(Symbol):
    f = open("logs", "w")
    f.write(Symbol+' Open =================>\n')
    try:
        myclient = pymongo.MongoClient(
            "mongodb://admin:password@localhost:27017/")
        data = pdr.get_data_yahoo(
            Symbol, period="max")
        data.reset_index(level=0, inplace=True)
        finalData = data.to_dict(orient="records")
        mydb = myclient["tickerTape"]
        collection = getColName(Symbol)
        mycol = mydb[collection]
        mycol.create_index([("Date", pymongo.DESCENDING)], unique=True)
        mycol.insert_many(finalData, ordered=False)
    except Exception as e:
        f.write(str(e))
    finally:
        myclient.close()
        f.write(' Close =================>\n')
        f.close()


def createIndex(Symbol):
    f = open("logs", "w")
    f.write(Symbol+' Open =================>\n')

    try:
        myclient = pymongo.MongoClient(
            "mongodb://admin:password@localhost:27017/")
        mydb = myclient["tickerTape"]
        collection = getColName(Symbol)
        mycol = mydb[collection]
        mycol.create_index([("Date", -1)], unique=True)
        f.write(collection+" created\n")
    except Exception as e:
        f.write(str(e))
    finally:
        myclient.close()
        f.write(' Close =================>\n')
        f.close()


def updateHistory(Symbol):
    f = open("logs", "a")
    try:
        myclient = pymongo.MongoClient(
            "mongodb://admin:password@localhost:27017/")
        mydb = myclient["tickerTape"]
        collection = getColName(Symbol)
        mycol = mydb[collection]
        start = mycol.find().sort([("Date", -1)]).limit(1)[0]["Date"]
        start = start.replace(tzinfo=datetime.timezone.utc)
        end = datetime.datetime.utcnow()
        data = pdr.get_data_yahoo(
            Symbol, start=start, end=end)
        data.reset_index(level=0, inplace=True)
        finalData = data.to_dict(orient="records")
        if len(finalData) != 0:
            mycol.update_one({"Date": finalData[0]["Date"]}, {
                             "$set": finalData[0]})
        if len(finalData) > 1:
            mycol.insert_many(finalData[1:], ordered=False)
    except pymongo.errors.BulkWriteError:
        pass
    except Exception as e:
        f.write(Symbol + ' '+str(e)+'\n')
    finally:
        f.write(Symbol+' '+start.strftime('%m/%d/%Y')
                + ' '+end.strftime('%m/%d/%Y')
                + '\n')
        myclient.close()
