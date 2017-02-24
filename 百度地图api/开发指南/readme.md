###helloworld
```
var map = new BMap.Map("container");          // 创建地图实例  
var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别 
//panTo()方法将让地图平滑移动至新中心点，如果移动距离超过了当前地图区域大小，则地图会直跳到该点。
map.panTo(new BMap.Point(116.409, 39.918));    
```

###控件
```
Control：控件的抽象基类，所有控件均继承此类的方法、属性。通过此类您可实现自定义控件。
NavigationControl：地图平移缩放控件，PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方。
OverviewMapControl：缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
ScaleControl：比例尺控件，默认位于地图左下方，显示地图的比例关系。
MapTypeControl：地图类型控件，默认位于地图右上方。
CopyrightControl：版权控件，默认位于地图左下方。
GeolocationControl：定位控件，针对移动端开发，默认位于地图左下方。
```
```
var map = new BMap.Map("container");    
map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);    
//地图平移缩放控件，PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方。
//anchor 位置，offset偏移
var opts = {type: BMAP_NAVIGATION_CONTROL_SMALL, anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(150, 5)} 
map.addControl(new BMap.NavigationControl(opts));

//OverviewMapControl：缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
map.addControl(new BMap.OverviewMapControl());

//ScaleControl：比例尺控件，默认位于地图左下方，显示地图的比例关系。
map.addControl(new BMap.ScaleControl());   

//MapTypeControl：地图类型控件，默认位于地图右上方。
map.addControl(new BMap.MapTypeControl());    
map.setCurrentCity("北京"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

//CopyrightControl：版权控件，默认位于地图左下方。
map.addControl(new BMap.CopyrightControl());

//GeolocationControl：定位控件，针对移动端开发，默认位于地图左下方。
map.addControl(new BMap.GeolocationControl());
```

###覆盖物
```
所有叠加或覆盖到地图的内容，我们统称为地图覆盖物。如标注、矢量图形元素(包括：折线和多边形和圆)、信息窗口等。覆盖物拥有自己的地理坐标，当您拖动或缩放地图时，它们会相应的移动。
地图API提供了如下几种覆盖物：
Overlay：覆盖物的抽象基类，所有的覆盖物均继承此类的方法。
Marker：标注表示地图上的点，可自定义标注的图标。
Label：表示地图上的文本标注，您可以自定义标注的文本内容。
Polyline：表示地图上的折线。
Polygon：表示地图上的多边形。多边形类似于闭合的折线，另外您也可以为其添加填充颜色。
Circle: 表示地图上的圆。
InfoWindow：信息窗口也是一种特殊的覆盖物，它可以展示更为丰富的文字和多媒体信息。注意：同一时刻只能有一个信息窗口在地图上打开。
```
```
```


