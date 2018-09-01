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
		<td>Log level. [Look levels](#levels)</td>
		<td><code>info</code></td>
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
		<td>Max length of json lines</td>
		<td><code>120</code></td>
	</tr>
	<tr>
		<td><code>json.inputColor</code></td>
		<td>Coloring function of input messages color in json</td>
		<td><code>chalk.rgb(167, 101, 121)</code></td>
	</tr>
	<tr>
		<td><code>json.outputColor</code></td>
		<td>Coloring function of output messages in json.</td>
		<td><code>chalk.rgb(95, 96, 169)</code></td>
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

TBD