# n=10000, c=1000

## 1 интанс бакенда
```
Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /api/v1/films
Document Length:        116 bytes

Concurrency Level:      1000
Time taken for tests:   14.151 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      3960000 bytes
HTML transferred:       1160000 bytes
Requests per second:    706.68 [#/sec] (mean)
Time per request:       1415.071 [ms] (mean)
Time per request:       1.415 [ms] (mean, across all concurrent requests)
Transfer rate:          273.29 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   14 108.4      0    1012
Processing:    86 1304 377.3   1160    2108
Waiting:       16 1295 378.1   1151    2102
Total:         86 1317 395.6   1163    2520

Percentage of the requests served within a certain time (ms)
  50%   1163
  66%   1502
  75%   1715
  80%   1805
  90%   1879
  95%   1903
  98%   1928
  99%   2393
 100%   2520 (longest request)

```

## 3 интанса с весами 2:1:1

```
Server Software:        fucinema
Server Hostname:        localhost
Server Port:            84

Document Path:          /api/v1/films
Document Length:        116 bytes

Concurrency Level:      1000
Time taken for tests:   9.191 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      4140000 bytes
HTML transferred:       1160000 bytes
Requests per second:    1087.97 [#/sec] (mean)
Time per request:       919.144 [ms] (mean)
Time per request:       0.919 [ms] (mean, across all concurrent requests)
Transfer rate:          439.86 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    4  11.4      0      58
Processing:     2  795 782.7    617    2132
Waiting:        2  795 782.7    617    2132
Total:          2  798 784.3    623    2147

Percentage of the requests served within a certain time (ms)
  50%    623
  66%   1372
  75%   1717
  80%   1739
  90%   1873
  95%   1900
  98%   1945
  99%   2046
 100%   2147 (longest request)
```

## Разница

Превосходство в скорости получении ответа: 54%

# n=100000, c=1000

## 1 интанс бакенда
```
Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /api/v1/films
Document Length:        116 bytes

Concurrency Level:      1000
Time taken for tests:   129.482 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      39600000 bytes
HTML transferred:       11600000 bytes
Requests per second:    772.31 [#/sec] (mean)
Time per request:       1294.822 [ms] (mean)
Time per request:       1.295 [ms] (mean, across all concurrent requests)
Transfer rate:          298.67 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    2  38.0      0    1033
Processing:    87 1290 636.7   1434    3785
Waiting:       14 1285 635.8   1427    3778
Total:         88 1292 641.7   1435    4096

Percentage of the requests served within a certain time (ms)
  50%   1435
  66%   1790
  75%   1844
  80%   1872
  90%   1958
  95%   2054
  98%   2543
  99%   2968
 100%   4096 (longest request)
```


## 3 интанса с весами 2:1:1
```
Server Software:        fucinema
Server Hostname:        localhost
Server Port:            84

Document Path:          /api/v1/films
Document Length:        116 bytes

Concurrency Level:      1000
Time taken for tests:   95.545 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      41400000 bytes
HTML transferred:       11600000 bytes
Requests per second:    1046.63 [#/sec] (mean)
Time per request:       955.448 [ms] (mean)
Time per request:       0.955 [ms] (mean, across all concurrent requests)
Transfer rate:          423.15 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   3.2      0      49
Processing:     1  947 954.9   1244    3810
Waiting:        1  947 954.9   1244    3810
Total:          1  947 955.3   1245    3832

Percentage of the requests served within a certain time (ms)
  50%   1245
  66%   1784
  75%   1833
  80%   1862
  90%   1956
  95%   2036
  98%   2481
  99%   2949
 100%   3832 (longest request)
```

## Разница

Превосходство в скорости получении ответа: 36%
