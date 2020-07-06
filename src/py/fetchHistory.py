from yahooFinance import fetchHistory, flushAll
import sys

if __name__ == "__main__":
    fetchHistory(sys.argv[1])
    flushAll()
