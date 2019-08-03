## Functions

<dl>
<dt><a href="#parseUi">parseUi(directory)</a> ⇒ <code><a href="#VueComponents">Promise.&lt;VueComponents&gt;</a></code></dt>
<dd><p>Deeply scans given directory looking for <code>.vue</code> files.</p>
</dd>
<dt><a href="#RollupPlugin">RollupPlugin(componentsSrc, destination, jsDist, cssFile)</a> ⇒ <code><a href="#RollupPlugin">RollupPlugin</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CategoryMeta">CategoryMeta</a> : <code>Object</code></dt>
<dd><p>Metadata of a category</p>
</dd>
<dt><a href="#VueComponent">VueComponent</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#VueComponents">VueComponents</a> : <code><a href="#VueComponent">Array.&lt;VueComponent&gt;</a></code></dt>
<dd><p>An array of <a href="#VueComponent">VueComponent</a></p>
</dd>
<dt><a href="#RollupPlugin">RollupPlugin</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="parseUi"></a>

## parseUi(directory) ⇒ [<code>Promise.&lt;VueComponents&gt;</code>](#VueComponents)
Deeply scans given directory looking for `.vue` files.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>String</code> | Directory to components |

<a name="RollupPlugin"></a>

## RollupPlugin(componentsSrc, destination, jsDist, cssFile) ⇒ [<code>RollupPlugin</code>](#RollupPlugin)
**Kind**: global function  
**Returns**: [<code>RollupPlugin</code>](#RollupPlugin) - The rollup plugin  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| componentsSrc | <code>String</code> |  | Where to read the components from |
| destination | <code>String</code> |  | Where to copy all of the asset files. Defaults to the rollup dist folder. |
| jsDist | <code>String</code> |  | Location of the js distribution. Defaults to rollup dist script. |
| cssFile | <code>String</code> | <code>style.css</code> | Destination to the css file. |

<a name="CategoryMeta"></a>

## CategoryMeta : <code>Object</code>
Metadata of a category

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| icon | <code>String</code> \| <code>null</code> | Icon of the component. See [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free). |
| name | <code>String</code> | Full name of the category. Defaults to the result of analyzing the anatomy of the directory structure. i.e. `/components/:category/component.vue` |

**Example**  
From `/:category/meta.json`
```json
{
  "name": "The category name",
  "icon": "apple"
}
```
<a name="VueComponent"></a>

## VueComponent : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | Absolute path to the component |
| name | <code>String</code> | The tag name of the component (i.e. `<component-name/>`) |
| category | [<code>Array.&lt;CategoryMeta&gt;</code>](#CategoryMeta) | Category of the component |
| docs | <code>String</code> | Markdown docs of the component |

<a name="VueComponents"></a>

## VueComponents : [<code>Array.&lt;VueComponent&gt;</code>](#VueComponent)
An array of [VueComponent](#VueComponent)

**Kind**: global typedef  
<a name="RollupPlugin"></a>

## RollupPlugin : <code>Object</code>
**Kind**: global typedef  
**See**: [https://rollupjs.org/guide/en#plugins-overview](https://rollupjs.org/guide/en#plugins-overview)  

* * *

&copy; 2019 Martin Rafael <tin@devtin.io>
