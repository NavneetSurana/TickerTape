from yahooFinance import updateHistory, flushAll
import sys

if __name__ == "__main__":
    updateHistory(sys.argv[1])
    flushAll()
