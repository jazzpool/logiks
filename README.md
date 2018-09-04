# Logiks 📝 [![Build Status](https://travis-ci.org/jazzpool/logx.svg?branch=master)](https://travis-ci.org/jazzpool/logx)

Simple colored logger module with levels of logging and semantic output.

```js
const logger = new Logiks({
    level: 'debug',
    colors: true,
});

logger.error('System', 'Component', 'Message')

> 2017-11-30 20:03:35 [System] [Component] Message
```

## Signature semantics

Logger can take up to 4 different positional arguments-groupings:
```
logger.error(
    system: string,
    component: string',
    subCategory: string,
    message: string',
)
```

Note that message argument will appear anyway and if `n`th argument missed it means that `n-1`th argu,ent is message argument.  Let assume we have code like bellow: 


```js
logger.special('Payments started');

logger.info('API', 'Payments', 'Performing payments');
/* ...*/
const response = {status: '200', confirmationHash:'d8e8fca2dc0f896fd7cb4cb'};
logger.info.json('API', 'Payments', 'v3.2', 'Payments was performed', response);
```

The output will be: 

```
2018-09-02 02:55:27 Payments started!
2018-09-02 02:01:12 [API] [Payments] Performing payments
2018-09-02 02:01:39 [API] [Payments] (v3.2) Payments was performed
2018-09-02 02:01:39 ───┬────────────────────────────────────────────────────────────────────────
2018-09-02 02:01:39 0  │ {
2018-09-02 02:01:39 1  │   "status": "200",
2018-09-02 02:01:39 2  │   "confirmationHash": "d8e8fca2dc0f896fd7cb4cb"
2018-09-02 02:01:39 3  │ }
2018-09-02 02:01:39 ───┴────────────────────────────────────────────────────────────────────────
```

### Groups

You can create logger instance already with grouping curried with:
 1. In configuration.Look at <a href="#config-groups">config groupings</a>.
 2. With methods `.withSystem`, `.withComponent` and `.withSubcat`.

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
			<h3 id="config-groups">Groups</h3>
			<p><i>All is null by default</i></p>
		</td>
	</tr>
	<tr>
		<td colspan=3><code>system</code></td>
	</tr>
	<tr>
		<td colspan=3><code>component</code> <i>(requires system></i>/td>
	</tr>
	<tr>
		<td colspan=3><code>subCat</code> <i>(requires component></i></td>
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

Levels are prioritized entities to separate log messages by semantic. You can cover yout code with logging different depth and if you want to run your app on production mode you will not see debug log level. These are default log levels of Logiks: 

 - `silly`: <span style="padding: 2px; color: white; background: black;">chalk.white</span>
 - `debug`: <span style="padding: 2px; color: green;">chalk.green</span>
 - `info`: <span style="padding: 2px; color: magenta;">chalk.magenta</span>
 - `warning`: <span style="padding: 2px; color: #d4ac80;">chalk.yellow</span>
 - `error`: <span style="padding: 2px; color: #db888a;">chalk.red</span>
 - `special`: <span style="padding: 2px; color: cyan; text-decoration: underline;">chalk.cyan.underline</span>
 - `critical`: <span style="padding: 2px; color: #db888a; text-decoration: underline; font-weight: bold;">chalk.red.underline.bold</span>

## JSON

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