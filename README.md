# logx 📝

Simple logger module 

```js
var log = new Logx({
	level: 'debug',
	color: true,
});

log.error('System', 'Component', 'Message')
```

> 2017-11-30 20:03:35 [System] [Component] Message

## Config

<table>
	<tr>
		<th>Option</th>
		<th>Description</th>
		<th>Default</th>
	</tr>
	<tr>
		<td><code>colors</code></td>
		<td>Should use colors</td>
		<td>false</td>
	</tr>
	<tr>
		<td><code>level</code></td>
		<td>Log level. <a href="#levels">Look levels</a></td>
		<td><code>info</code></td>
	</tr>
	<tr>
		<td><code>date</code></td>
		<td>Should every message line prefixed with date or not</td>
		<td><code>true</code></td>
	</tr>
	<tr>
		<td><code>levels</code></td>
		<td>Levels description and priorities. Index in table is priority, and value is a array where 1st element is name of level and second is a coloring function.</td>
		<td><pre>
[
    ['silly', chalk.white],
    ['debug', chalk.green],
    ['info', chalk.magenta],
    ['warning', chalk.yellow],
    ['error', chalk.red],
    ['special', chalk.cyan.underline],
    ['critical', chalk.red.underline.bold],
]
</pre></td>
	</tr>
	<tr>
		<td colspan=3>
			<h3>json</h3>
		</td>
	</tr>
	<tr>
		<td><code>json.maxLength</code></td>
		<td>Max length of lines in json message. JSON will be stringified counting this option.</td>
		<td><code>64</code></td>
	</tr>
		<tr>
		<td><code>json.maxRowLength</code></td>
		<td>Max line length in json message, if symbols count exceeded it will be striped by ...</td>
		<td><code>process.stdout.columns - 5</code></td>
	</tr>
	<tr>
		<td><code>json.defaultColor</code></td>
		<td>Default coloring function of messages in json</td>
		<td><code>chalk.rgb(167, 101, 121)</code></td>
	</tr>
</table>	

## Levels

Levels are prioritized entities to separate log messages by semantic. You can cover yout code with logging different depth and if you want to run your app on production mode you will not see debug log level. These are default log levels of LogX: 

 - `silly`: <span style="padding: 2px; color: white; background: black;">chalk.white</span>
 - `debug`: <span style="padding: 2px; color: green;">chalk.green</span>
 - `info`: <span style="padding: 2px; color: magenta;">chalk.magenta</span>
 - `warning`: <span style="padding: 2px; color: #d4ac80;">chalk.yellow</span>
 - `error`: <span style="padding: 2px; color: #db888a;">chalk.red</span>
 - `special`: <span style="padding: 2px; color: cyan; text-decoration: underline;">chalk.cyan.underline</span>
 - `critical`: <span style="padding: 2px; color: #db888a; text-decoration: underline; font-weight: bold;">chalk.red.underline.bold</span>

## json

Every level logging function has `.json` property. 

```js
logger.warning.json('API', 'Payments', 'v3.2', 'Health check failed', {"reward":128.23,"instances":2,"availableApis":[{"host":"127.0.0.1","port":8888},{"host":"127.0.0.1","port":8889}],"healthCheck":false})
```

Will produce: 

```
2018-09-01 10:58:16 [API] [Payments] (v3.2) Health check failed
2018-09-01 10:58:16 ───┬───────────────────────────────────────────────────────────────────
2018-09-01 10:58:16 0  │ {
2018-09-01 10:58:16 1  │   "reward": 128.23,
2018-09-01 10:58:16 2  │   "instances": 2,
2018-09-01 10:58:16 3  │   "availableApis": [
2018-09-01 10:58:16 4  │     { "host": "127.0.0.1", "port": 8888 },
2018-09-01 10:58:16 5  │     { "host": "127.0.0.1", "port": 8889 }
2018-09-01 10:58:16 6  │   ],
2018-09-01 10:58:16 7  │   "healthCheck": false
2018-09-01 10:58:16 8  │ }
2018-09-01 10:58:16 ───┴───────────────────────────────────────────────────────────────────
```