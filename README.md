## Functions

<dl>
<dt><a href="#parseVueDocs">parseVueDocs(directory)</a> ⇒ <code>Promise.&lt;Array.&lt;VueComponent&gt;&gt;</code></dt>
<dd><p>Deeply scans given directory looking for <code>.vue</code> files.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CategoryMeta">CategoryMeta</a> : <code>Object</code></dt>
<dd><p>Metadata of a category</p>
</dd>
<dt><a href="#VueComponent">VueComponent</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="parseVueDocs"></a>

## parseVueDocs(directory) ⇒ <code>Promise.&lt;Array.&lt;VueComponent&gt;&gt;</code>
Deeply scans given directory looking for `.vue` files.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;VueComponent&gt;&gt;</code> - Array of [VueComponent](#VueComponent)'s  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>String</code> | Directory to components |

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


* * *

&copy; 2019 Martin Rafael <tin@devtin.io>
