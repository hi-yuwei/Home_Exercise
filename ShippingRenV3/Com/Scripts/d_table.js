/** d_table **/

var Msg={
	//容器id参数不正确（容器id设置错误！\n请检查）
	d1:"\u5bb9\u5668id\u8a2d\u7f6e\u932f\u8aa4\uff01\n\u8acb\u6aa2\u67e5",
	//删除行，如果行内有内容，提示是否删除（确认是否删除此行？\n*此行有数据）
	d2: "\u786e\u8ba4\u662f\u5426\u5220\u9664\u6b64\u884c\uff1f\n*\u6b64\u884c\u6709\u6570\u636e",
	//提交数据时，textarea id没指定，提示错误（参数配置错误！）
	d3: "\u53c3\u6578\u914d\u7f6e\u932f\u8aa4\uff01",
	//删除行，如果行内有内容，提示是否删除（确认是否删除选中行？\n*选中行有数据）
	d4: "\u786e\u8ba4\u662f\u5426\u5220\u9664\u9009\u4E2D\u884c\uff1f\n*\u9009\u4E2D\u884c\u6709\u6570\u636e"
}

function Dtable() {
    this.ConDivID = arguments[0];
    if (!this.ConDivID) { alert(Msg.d1); return; }
    if (arguments[1] != "undefined") this.TittleArray = arguments[1];
    this.Rows = arguments[2] || 1;
    var self = this;
    self.H_top = 0;//表头距页顶端距离
    self.RowSum = 1;//行总数----除去表头，默认总数为1行
    self.RowList = [];//保存被选中行行号，方便执行多行删除操作
    self.ColumnSum = 0;//列总数----除去正文内容的列，默认有checkbox列+操作列
    self.RowRule = [];//保持td宽度和td内容形式，如：checkbox or radio，默认textarea；规则：宽度\n形式
    self.txtArr = [];//临时保存表格数据
    self.key = 0;//按键keycode
    self.ToCode = true;//是否加密传输
    
    /* 全局 CSS 变量
    over_color 鼠标划过，行背景变色
    out_color 鼠标移开，行背景色还原
    txt_b_color	文本框编辑状态下的边框颜色
    */
    self.css = {
        over_color: "rgb(234,236,245)",
        out_color: "#ffffff",
        txt_b_color: "rgb(255,251,202)"
    };
    
    self.ac={
    t2: "end_port",
    t3: "ship_com",
    t4: "day",
    t5: "air_port",
    w1:300,
    w2:250,
    w3:60,
    ci:-1
    };
    //绘制表格（初始化表格）
    this.DrawTable = function() {
        self.ColumnSum = self.TittleArray.length; //列总数
        var Tempstr = "", eid = "";
        var TableHTML = [], Tlist = [];
        var i = 0, j = 0, h = 0;
        TableHTML.push("<table id=\"" + self.ConDivID + "_Table\" class=\"dtable\">");
        //表头
        TableHTML.push("<thead><tr><th colspan=\"" + self.ColumnSum + "\" style=\"border: 0;\">");
        TableHTML.push("<div class=\"dtHeadDiv\">");
        TableHTML.push("<div id=\"" + self.ConDivID + "_TittleDiv\" class=\"dtFixedDiv\">");
        TableHTML.push("<table class=\"TitleTable\">");
        TableHTML.push("<tr>");
        for (i = 0; i < self.ColumnSum; i++) {
            eid = self.ConDivID + "thead_" + i;
            Tlist = self.TittleArray[i];
            //TableHTML.push("<th style=\"width:" + Tlist.w + "px;\">");
            if (typeof (Tlist.t) != "undefined") {
                switch (Tlist.t) {
                    case "cb":
							
                    case "checkbox":
                        if (typeof (Tlist.v) != "string") {
							TableHTML.push("<th style=\"width:" + Tlist.w + "px;\">");
                            TableHTML.push("<input id=\"" + eid + "\" type=\"checkbox\" " + tclass(Tlist.c) + "/>");
                        }
                        else {
							TableHTML.push("<th style=\"width:" + Tlist.w + "px;\">");
                            TableHTML.push("<label for=\"" + eid + "\"><input id=\"" + eid + "\" type=\"checkbox\" " + tclass(Tlist.c) + "/>" + Tlist.v + "</label>");
                        }
                        break;
                    case "span":
						TableHTML.push("<th style=\"width:" + Tlist.w + "px;\">");
                        TableHTML.push("<span id=\"" + eid + "\" " + tclass(Tlist.c) + ">" + Tlist.v + "</span>");
                        break;
                    default:
						TableHTML.push("<th style=\"width:" + (Tlist.w+0) + "px;\">");
                        TableHTML.push(Tlist.v);
                        break;
                }
            }
            else {
				TableHTML.push("<th style=\"width:" + (Tlist.w+0) + "px;\">");
                TableHTML.push(Tlist.v);
            }
            TableHTML.push("</th>");
        }
        TableHTML.push("</tr></table>");
        TableHTML.push("</div></div></th></tr></thead>");

        //tbody
        TableHTML.push("<tbody id=\"DTBox_Tbody\">");
        /**/
        for (h = 1; h <= self.Rows; h++)//行 循环
        {	
			TableHTML.push("<tr id=\"" + self.ConDivID + "_" + h + "\">");
            for (i = 0; i < self.ColumnSum; i++)//列 循环
            {
                eid = self.ConDivID + "_" + h + "_" + i;
                Tlist = self.TittleArray[i];
                TableHTML.push("<td style=\"width:" + Tlist.w + "px;\">");
                if (typeof (Tlist.t) != "undefined") {
                    switch (Tlist.t) {
                        case "cb":
                        case "checkbox":
                            //TableHTML.push("<input id=\"" + eid + "\" type=\"checkbox\"/>");
							TableHTML.push("<label style=\"display: block; width: " + Tlist.w + "px;\"><input id=\"" + eid + "\" type=\"checkbox\" " + tclass(Tlist.c) + "/></label>");
                            break;
                        case "span":
                            TableHTML.push("<span id=\"" + eid + "\" " + tclass(Tlist.c) + ">删除</span>");
                            break;
                        case "textarea":
                        case "input":
                        default:
							if(Tlist.vid) {
								TableHTML.push("<textarea id=\"" + eid + "\" style=\"width:" + Tlist.w + "px;\" class=\"t_h txt\" "+ac_str(Tlist.ac)+" vid=\""+Tlist.vid+"\"></textarea>");
							} else {
								TableHTML.push("<textarea id=\"" + eid + "\" style=\"width:" + Tlist.w + "px;\" class=\"t_h txt\" "+ac_str(Tlist.ac)+"></textarea>");
							}
                            break;
                    }
                }
                else {
					if(Tlist.vid) {
						TableHTML.push("<textarea id=\"" + eid + "\" style=\"width:" + Tlist.w + "px;\" class=\"t_h txt\" "+ac_str(Tlist.ac)+" vid=\""+Tlist.vid+"\"></textarea>");
					} else {
						TableHTML.push("<textarea id=\"" + eid + "\" style=\"width:" + Tlist.w + "px;\" class=\"t_h txt\" "+ac_str(Tlist.ac)+"></textarea>");
					}
                }
                TableHTML.push("</td>");
            }
            TableHTML.push("</tr>");
        }
        TableHTML.push("</tbody>");
        TableHTML.push("</table>");

        document.getElementById(self.ConDivID).innerHTML = TableHTML.join("");
        
        
    }
    /************* 方法 *****************************/
    /*初始化table
    *1,注册表头滚动事件
    *2,創建彈出窗
    *3,填充动作
    */
    this.init = function() {
		
        self.thead = document.getElementById(self.ConDivID + "_Table").getElementsByTagName("thead")[0];
        self.tbody = document.getElementById(self.ConDivID + "_Table").getElementsByTagName("tbody")[1];
        /*綁定 表頭滾動 事件*/
        self.H_top = getPosition(document.getElementById(self.ConDivID + "_TittleDiv")).y;
        self._onScroll();
        /*創建彈出层*/
        self._CreatDiv();
        /*註冊 Table內控件各類事件*/
        self.actionFill();

    }
    /*	填充动作	*/
    this.actionFill = function() {
        /*註冊 表頭的checkbox全選 事件*/
		
        for (i = 0; i < self.ColumnSum; i++) {
            var Tlist = self.TittleArray[i];
            if (Tlist.t === "checkbox") {
                document.getElementById(self.ConDivID + "thead_" + i).setAttribute("col", i);
                document.getElementById(self.ConDivID + "thead_" + i).onclick = function() { self.selectAll(this.getAttribute('col')) };
            }
        }
        /*註冊 input相關事件
        *注：因為textarea 都是同一事件，所以不用getElementById來取控件了
        *
        */
        var InputList = self.tbody.getElementsByTagName("textarea");
        var L_length = InputList.length;
        var i = 0;
        for (i = 0; i < L_length; i++) {
            InputList[i].onfocus = function() { self.StopKeyListen(); self.readedit(this) };
            InputList[i].onblur = function() { self.KeyListen(); this.style.borderColor = self.css.out_color;};
        	var t = InputList[i].getAttribute("sou_type");
        	if(t!==null){
        		if(t===self.ac.t4)
        		{
        			InputList[i].onclick = function(){
	        			self.ac.input =_d = this;
	        			var _z = getPosition(_d);
				    	var _w =0;
				    	if(navigator.userAgent.indexOf("MSIE 6.0")>0){
				    	self.ac.zdiv.style.left = (_z.x+10) + "px";
						self.ac.zdiv.style.top = (_z.y + _d.offsetHeight+17) + "px";
						}
						else{
						self.ac.zdiv.style.left = _z.x + "px";
						self.ac.zdiv.style.top = (_z.y + _d.offsetHeight) + "px";
						}
						self.ac.zdiv.style.width = self.ac.w3 + "px";
						self.ac.zdiv.style.visibility = "visible";
						self.ac.zdiv.onmouseover = self.om;				
		    			if (document.addEventListener) {
					        self.ac.input.addEventListener("blur", self.rns, true);
					    } else {
					        self.ac.input.attachEvent("onblur", self.rns);
					    }
				    	self.dayList_show();
			    	};
        		}
        	}
            InputList[i].ondblclick = function(event) { /**/self.AutoFix(event); };
            InputList[i].parentNode.parentNode.onmouseover = function() { self.onChangTrColor(this) };
            InputList[i].parentNode.parentNode.onmouseout = function() { self.outChangTrColor(this) };
            //InputList[i].onclick = function() { };
            //InputList[i].onkeydown = function(event) { self.gonext(event, this) };
            /*InputList[i].onkeyup = function() {
                //檢驗text，處理excel數據
                self.read_excel(this);
                //自動完成功能
            };
            */
			
            if (document.addEventListener){
				
            	InputList[i].addEventListener("keydown", function(event) { self.gonext(event) }, true);
            	InputList[i].addEventListener("keyup", self.okuh, true);
            	InputList[i].addEventListener("input", function(){self.read_excel(this)},false);
				
            }else{
				InputList[i].onpropertychange=function(){self.read_excel(this)};
            	InputList[i].attachEvent("onkeydown", function(event){self.gonext(event)});
            	
				InputList[i].attachEvent("onkeyup", self.okuh);
            }
            
            /*

            //
            if (InputList[i].type === "checkbox") {
                var s = InputList[i].id;
                //取第一列的checkbox
                if (s.split("_")[2] == 0) {
                    InputList[i].onclick = function() { self.selectTr(this) };
                }
            }*/
        }
        /*註冊 刪除行事件*/

        for (i = 1; i <= self.Rows; i++) {
            var c = parseInt(self.ColumnSum, 10) - 1;
            var ddd = self.ConDivID + "_" + i + "_" + c;
            document.getElementById(ddd).onclick = function() {
                var r = this.id.split("_")[1];
                var tr = document.getElementById(self.ConDivID + "_" + r);
                var txlist = tr.getElementsByTagName("textarea");
                var tl = txlist.length;
                for (var i = 0; i < tl; i++) {
                    if (txlist[i].value.Trim().length > 0) {
                        r = 0;
                        break;
                    }
                }
                if (r == 0) {
                    if (confirm(Msg.d2))
                        self.delTr(1, this.id);
                } else { self.delTr(1, this.id) }
            }
        }
    }
    /*相应onkeydown*/
    this.gonext = function(event) {
        /* 功能描述：方向键↑↓移动焦点。
		*/
		var e=event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        self.key =e;
        var t="";
        if(!document.addEventListener){t=event.srcElement.id}else{t=event.target.id};
        if(event.ctrlLeft===true&&e==90){return false;}
        var f_txt =function(e,t){
        	var n=0,a="";
	        if(e==40||e==38){
		        if(e==40)n = parseInt(t.split("_")[1],10) + 1;
		        if(e==38)n = parseInt(t.split("_")[1],10) - 1;
		        a = self.ConDivID+"_"+n+"_"+t.split("_")[2];
	        }
	        if(e==37||e==39){
	        	if(document.getElementById(t).value.length>0)return;
	        	if(e==39)n = parseInt(t.split("_")[2],10) + 1;
		        if(e==37)n = parseInt(t.split("_")[2],10) - 1;
		        a = self.ConDivID+"_"+t.split("_")[1]+"_"+n;
	        }
	        if(document.getElementById(a)!=null){
	        	if(document.getElementById(a).tagName === "TEXTAREA"){
		        	document.getElementById(a).focus();
		        	return;
		        }
		        else{
		        	f_txt(e,a);
		        }
		    }
	    }
	    if(e==40||e==38||e==13||e==37||e==39){
	    	if(self.ac.zdiv.style.visibility ==="hidden" || self.ac.zdiv.style.visibility===""){
	    		f_txt(e,t);
	    	}
	    	else{
	    		if(e==13){
	    			self.si();
	    			return false;
	    		}
	    	}
	    }
        if(e==9||e==27)
        if(self.ac.zdiv.style.visibility !=="hidden" || self.ac.zdiv.style.visibility!==""){
        	self.rns();
        }
    }
    /*响应onkeyup*/
    this.okuh =function(evt)
    {

    	var e = self.key;
    	/*弹出层相关
        	0-9 A-Z 48-57 65-90
        	空格 32
        	小键盘0-9 96-105
        	delete 46
        	backspace 8
        	‘	222
        	上下		38 40
        	輸入法 229
        */
        if(e==13){  
        	self.ac.input.value = self.ac.input.value.replace(/\r|\n/gmi, "");
        }
        if(48<=e&&e<=90||e==32||96<=e&&e<=105||e==38||e==40||e==46||e==8||e==222||e==229){
        	var _d =document.activeElement;
	    	if(_d.tagName!=="TEXTAREA")return;
	    	self.ac.input = _d;
	    	if(_d.value.Trim().length<1)return;
	    	self.ac.t = _d.getAttribute("sou_type");
	    	if(self.ac.t===null)return;
	    	
			if(self.ac.zdiv.style.visibility ==="hidden" || self.ac.zdiv.style.visibility==="" ||self.ac.t===self.ac.t4)
			{
				if(48<=e&&e<=90||e==32||96<=e&&e<=105||e==229)
				{
					var _z = getPosition(_d);
					var _w =0;
					if(navigator.userAgent.indexOf("MSIE 6.0")>0){
					self.ac.zdiv.style.left = (_z.x+10) + "px";
					self.ac.zdiv.style.top = (_z.y + _d.offsetHeight+17) + "px";
					}
					else{
					self.ac.zdiv.style.left = _z.x + "px";
					self.ac.zdiv.style.top = (_z.y + _d.offsetHeight) + "px";
					}
					if(self.ac.t===self.ac.t2)
						_w =self.ac.w1;
					if(self.ac.t===self.ac.t5||self.ac.t===self.ac.t3)
						_w = self.ac.w2;
					if(self.ac.t===self.ac.t4)
						_w = self.ac.w3;
					self.ac.zdiv.style.width = _w + "px";
					self.ac.zdiv.style.visibility = "visible";
					self.ac.zdiv.onmouseover = self.om;
					if (document.addEventListener) {
						self.ac.input.addEventListener("blur", self.rns, true);
					} else {
						self.ac.input.attachEvent("onblur", self.rns);
					}
					if(self.ac.t===self.ac.t4){
						self.dayList_show();
						return;
					}
					//alert(self.ac.input.value);
					self.gi();
				}
			}
			else{
				if(self.ac.t===self.ac.t4){
					self.dayList_show();
					return;
				}
				if (e == 38 || e == 40) {
					self.si();
				}
				else {
					if (e === 13) {
						if (self.ac.ci === -1) {
							
							self.gi();
						}
						else {
							return false;
						}
					}
					else {
						self.gi();
					}
				}
			}
        }
    }
    this.om=function(){
    	if (document.removeEventListener) {
        	self.ac.input.removeEventListener("blur", self.rns, true);
	    } else {
	    	self.ac.input.detachEvent("onblur", self.rns);
	    }
    }
    this.ot=function(){
	    if (document.addEventListener) {
	        self.ac.input.addEventListener("blur", self.rns, true);
	    } else {
	        self.ac.input.attachEvent("onblur", self.rns);
	    }
    }
    /*向弹出层写入数据*/
    this.gi = function()
    {
    	var a = new Date();/*监测时间语句，可删除*/
    	//var s = self.ac.input.value.replace(/(^\s*)|(\s*$)/g, "");
		var s = self.ac.input.value.Trim();
		//alert(self.ac.input.value);
    	var r="",tx=[],q=0,cn = "", ch = "",en = "", cou = "";
    	if(self.ac.t===self.ac.t2){
    		r = ep || "[]";
    	}
    	if(self.ac.t===self.ac.t3){
    		r = sb || "[]";
    	}
    	if(self.ac.t===self.ac.t5)
    	{
    		if (s.length > 0) {
            if (IsZH(s)) {
                tx = AirlistIndex;
            }
            else {
                var air_l = s.split("");
                for (var j = 0; j < 26; j++) {
                    if (AirlistIndex[j] == air_l[0].toUpperCase()) {
                        r = Airportlist[j];
                        eval("tx = " + r);
                        break;
                    }
                }
	            }
	        }
	        else {
	            r = Airportlist[0];
	            eval("tx = " + r);
	        }
    	}
    	if(self.ac.t===self.ac.t2||self.ac.t===self.ac.t3)
    	{
    		eval("tx = " + r);
    	}
    	var l=tx.length;
    	var tp=[],e=[];
    	for(q=0;q<l-1;q++){
    		if(self.ac.t===self.ac.t2||self.ac.t===self.ac.t3)
    		{
    			cn =tx[q].c;
    			ch =tx[q].z;
    		}
    		switch(self.ac.t)
    		{
    			case self.ac.t2:
    				if (cn.indexOf(s.toUpperCase()) == 0 || ch.indexOf(s) == 0)
                    	tp.push("<a href=\"javascript:void(0)\" title=\"" + tx[q].g + "\" id=\"" + cn + "\"><span>" + ch + "(" + tx[q].h + ")</span>" + cn + "</a>");
                	break;
                case ac.t3:
	                if (cn.indexOf(s.toUpperCase()) == 0 || ch.indexOf(s) == 0)
	                    tp.push("<a href=\"javascript:void(0)\" id=\"" + cn + "\"><span>" + ch + "</span>" + cn + "</a>");
	                break;
                case ac.t5:
	                if (!IsZH(s)) {
	                    cn = tx[q].s;
	                    ch = tx[q].c;
	                    en = tx[q].e;
	                    cou = tx[q].a;
	                    if (cn.indexOf(s.toUpperCase()) == 0 || en.toUpperCase().indexOf(s.toUpperCase()) == 0) {
	                        tp.push("<a href=\"javascript:void(0)\"  id=\"" + cn + "\" title=\"" + en + "\"><span>" + ch + " (" + cou + ")</span>" + cn + "</a>");
	                    }
	                }
	                else {
	                    eval("txt = " + Airportlist[q]);
	                    al = txt.length;
	                    for (j = 0; j < al - 1; j++) {
	                        cn = txt[j].s;
	                        ch = txt[j].c;
	                        en = txt[j].e;
	                        cou = txt[j].a;
	                        if (ch.indexOf(s) == 0) {
	                            vc = 0, zv = 0, zt = 0;
	                            vc = e.length;
	                            for (zv = 0; zv < vc; zv++) {
	                                if (cn === e[zv]) { zt = 1; break; }
	                            }
	                            if (zt == 0) {
	                                e.push(cn);
	                                tp.push("<a href=\"javascript:void(0)\" id=\"" + cn + "\" title=\"" + en + "\"><span>" + ch + " (" + cou + ")</span>" + cn + "</a>");
	                            }
	
	                        }
	                    }
	                }
	                break;
	            default:
	                break;
    		}
    		
    	}
    	//document.getElementById("cc").innerHTML += (new Date().getTime()-a.getTime()) +"毫秒<br/>";
		//document.getElementById("cc").innerHTML +=txt+"毫秒<br/>";
		e = [];
	    txt ="";
	    txt+="<div id=\"prot_warp\">";
	    if (tp.length < 1) {
	        txt+="<div id=\"prot_message\" style=\"color:#C0C0C0\">对不起,找不到:" + s + "</div>";
	    }
	    else {
	        if (t != self.ac.t4)
	            txt+="<div id=\"prot_message\">输入中文/拼音/缩写或↑↓选择.</div>";
	    }
	    txt+="<div id=\"prot_list\">";
	    txt+=tp.join("");
	    txt+="</div></div>";
	    self.ac.zdiv.innerHTML = txt;
	    ia = document.getElementById("prot_list").getElementsByTagName("a");
	    var len =ia.length;
	    for (var i = 0; i <len; i++) {
	        ia[i].onclick=function(){
	        	self.ac.input.value = this.id;
	        	self.rns();
	        };
	    }
	    self.ac.ci = -1;
    }
    this.si = function() {
    	var _k = self.key;
	    ia = document.getElementById("prot_list").getElementsByTagName("a");
	    q = ia.length;
		if(_k === 38||_k === 40){
		    if (_k === 38) {
		        self.ac.ci -= 1; if (self.ac.ci < 0) self.ac.ci = q - 1;
		    }
		    if (_k === 40) {
		        self.ac.ci += 1; if (self.ac.ci == q) self.ac.ci = 0;
		    }
		    for (var i = 0; i < q; i++) {
		        ia[i].className = "";
		    }
		    ia[self.ac.ci].className = "hov";
	    }
	    if (_k === 13) {
	        var s = ia[self.ac.ci].id;
	        self.ac.input.value = s;
	        //document.getElementById("cc").innerHTML +=self.ac.input.value+"<br/>";
	        self.rns();
	        //self.ac.input.select();
	        return false;
	    }
	
	    
	}
	/*關閉彈出層*/
	this.rns = function() {
		self.ac.zdiv.style.visibility="hidden";
		self.ac.ci=-1;
	}
	this.aaa = function() {
		self.ac.zdiv.style.visibility="hidden";
		self.ac.ci=-1;
	}
	/*收集列數據，判斷重複。彈出智能菜單*/
	this.AutoFix = function(event){
		var t,o,n=0,i=0,j=0,_j=0,_isOK=0,templist=[],tp=[];
		var e=event||window.event;
		t=e.target||e.srcElement;
		self.ac.input = t;
		//收集一列的數據,判斷重複數據
		n=parseInt(t.id.split("_")[2], 10);
		for (i = 0; i < self.ColumnSum; i++) {
			o=document.getElementById(self.ConDivID + "_" + i + "_" + n);
			if(o!=null)
			if(o.tagName=="TEXTAREA"){
				//判斷重複
				_j=templist.length;
				for(j=0;j<_j;j++){
					if(templist[j]===o.value){
					_isOK=1;break;}
				}
				if(_isOK==0)
				if(o.value.length>0)
				templist.push(o.value);
				_isOK=0;
			}
		}
		//document.getElementById("cc").innerHTML +=templist.join("|");
		//向彈出層寫入數據
		_j=templist.length;
		if(_j>0){
		//定位
		var _z = getPosition(t);
    	var _w =0,_h=0;
    	_w=t.offsetWidth/2;
    	_h=t.offsetHeight/2;
    	if(navigator.userAgent.indexOf("MSIE 6.0")>0){
    	self.ac.zdiv.style.left = (_z.x+_w+10) + "px";
		self.ac.zdiv.style.top = (_z.y+_h+17) + "px";
		}
		else{
		self.ac.zdiv.style.left = (_z.x+_w+20) + "px";
		self.ac.zdiv.style.top = (_z.y + _h) + "px";
		}
		self.ac.zdiv.style.width ="100px";
		self.ac.zdiv.style.visibility = "visible";
		//寫入數據
		for(j=0;j<_j;j++){
			tp.push("<a href=\"javascript:void(0)\" id=\"" + templist[j] + "\">" + templist[j]+ "</a>");
		}
		txt ="";
	    txt+="<div id=\"prot_warp\">";
	    if (tp.length < 1) {
	        self.ac.zdiv.style.visibility = "hidden";
	    }else{
	    txt+="<div id=\"prot_list\">";
	    txt+=tp.join("");
	    txt+="</div></div>";
	    self.ac.zdiv.innerHTML = txt;
	    ia = document.getElementById("prot_list").getElementsByTagName("a");
	    var len =ia.length;
	    for (var i = 0; i <len; i++) {
	        ia[i].onclick=function(){
	        	t.value = this.id;
	        	self.rns();
	        };
	    }
	    tp=[];
	    if (document.addEventListener) {
	        t.addEventListener("blur", self.rns, true);
	    } else {
	        t.attachEvent("onblur", self.rns);
	    }
	    self.ac.zdiv.onmouseover = self.om;
	    }}
	}
	/*出发日 下拉列表 数据填充、展示*/
	this.dayList_show=function(){
		var r="",tx=[],l=0,arr=[],s="",h=0,q=0,z=0;
		var t =document.activeElement;
    	if(t.tagName!=="TEXTAREA")return;
    	self.ac.input = t;
		r = day;
		eval("tx = " + r);
		l=tx.length;
		var txlist = t.value.split('/');//alert("txlist.length="+txlist.length);
		
		for(var i=0;i<l-1;i++)
		{
			s ="";
			s +="<label for=\"day_list_"+i+"\">"+
					"<input type=\"checkbox\" "+
					"name=\"daylist_check\" id=\"day_list_"+i+"\"";
			h = txlist.length;
			z=0;
			for(q=0;q<h;q++){
				if(txlist[q]===tx[i].c){
					z=1;txlist.shift();break;
				}
			}
			if(z!=0){
				s+= " checked=\"checked\"";
			}
			s +=" v=\""+tx[i].c+"\"/>"+
				tx[i].z +"</label>";
			
			arr.push(s);
		}
		//插入關閉按鈕
		arr.push("<span id=\"day_close\" class=\"dayclose\">关闭</span>");
		//插入數據
		if (arr.length < 1) {
	        self.ac.zdiv.style.visibility = "hidden";
	    }else{
		    txt ="";
		    txt+="<div id=\"prot_list\" style=\"background-color: white;\">";
		    txt+=arr.join("");
		    txt+="</div></div>";
		    self.ac.zdiv.innerHTML = txt;
		    
		    document.getElementById("day_close").onclick=function(){
		    	self.rns();
		    }
		    var ia = document.getElementsByName("daylist_check");
		    var len =ia.length;
		    for (var i = 0; i <len; i++) {
		        ia[i].onclick=self.daycheck;
		    }
		    arr=[];
		    if (document.addEventListener) {
		        t.addEventListener("blur", self.rns, true);
		    } else {
		        t.attachEvent("onblur", self.rns);
		    }
		    self.ac.zdiv.onmouseover = self.om;
	    }
		//alert(self.ac.zdiv.innerHTML);
		
	}
	/*出發日 下來菜單 相應onclick*/
	this.daycheck=function(){
	//alert(this.getAttribute("v"));
		var List=[];
		if(this.getAttribute("v")==="DAILY"){
			if(this.checked==true){
    		self.ac.input.value= this.getAttribute("v");
    		self.rns();}
       	}else{
			var ia = document.getElementsByName("daylist_check");
		    var len =ia.length;
		    for (var i = 1; i <len; i++) {
		        if(ia[i].checked===true){
		        	List.push(ia[i].getAttribute("v"));
		        }
		    }
		    if(List.length!==7){
		    	self.ac.input.value=List.join("/");
		    	ia[0].checked=false;
		    }else{
		    	self.rns();
		    	self.ac.input.value="DAILY";
		    	
		    }
		 }
	}
    this.read_excel = function(obj) {
        var _r = [], _c = [], _rl = 0, _cl = 0, _clm = 0, _rs = 0, _cs = 0, i = 0, j = 0, n = 0, m = 0, q = 0;
        var _s = obj.value.Trim();
        if (_s.split("\t").length > 1 || _s.split("\n").length > 1) {
            _r = _s.split("\n");
            _rl = _r.length;
            for (i = 0; i < _rl; i++) {
                _c = _r[i].split("\t");
                _cl = _c.length;
				if(_clm < _cl) {
					_clm = _cl;
				}
                self.txtArr[i] = [];
                for (j = 0; j < _cl; j++) {
                    self.txtArr[i][j] = _c[j];
                }
            }
            _rs = parseInt(obj.id.split("_")[1], 10);
            _cs = parseInt(obj.id.split("_")[2], 10);
            m = self.Rows - _rs - _rl + 1;
            if (m < 0) {
                self.addTr(Math.abs(m));
            }
            q = parseInt(_clm, 10) + parseInt(_cs, 10);
            for (i = _rs; i < (parseInt(_rl, 10) + parseInt(_rs, 10)); i++) {
                m = 0;
                for (j = _cs; j < q; j++) {
                    _s = self.ConDivID + "_" + i + "_" + j;
                    if (document.getElementById(_s) != null) {
                        if (i == _rs) {
                            if (document.getElementById(_s).tagName !== "TEXTAREA")
                            { q++; }
                        }
                        if (document.getElementById(_s).tagName === "TEXTAREA") {
                            if (document.getElementById(_s) !== null && self.txtArr[n][m] != undefined) {
                                document.getElementById(_s).value = self.txtArr[n][m].replace(/\r|\n/gmi, "");
                                m++;
                            }
                        }
                    }
                }
                n++;
            }
            //obj.focus();
        }
	}
    //点击第一个checkbox后触发的事件
    this.selectTr = function(obj) {
        //暂无任何动作
    }
    /* 鼠标单击文本框，进入编辑状态 */
    this.readedit = function(obj) {
        /*文本框邊框變色*/
        obj.style.borderColor = self.css.txt_b_color;
        obj.select();
    }
    /* 表格行变色 */
    this.onChangTrColor = function(obj) {
        var c = self.css.over_color;
        //行背景变色
        obj.style.backgroundColor = c;
        /*行内控件背景变色*/
        var lis = obj.getElementsByTagName("textarea");
        for (var i = 0; i < lis.length; i++) {
            lis[i].style.backgroundColor = c;
            lis[i].style.borderColor = c;
        }
    }
    this.outChangTrColor = function(obj) {
        var c = self.css.out_color;
        //行背景变色
        obj.style.backgroundColor = c;
        /*行内控件背景变色*/
        var lis = obj.getElementsByTagName("textarea");
        for (var i = 0; i < lis.length; i++) {
            lis[i].style.backgroundColor = c;
            lis[i].style.borderColor = c;
        }
    }
    /* checkbox全選 */
    this.selectAll = function(t) {
        var h = 0;
        for (h = 1; h <= self.Rows; h++)//行 循環
        {
            document.getElementById(self.ConDivID + "_" + h + "_" + t).checked = document.getElementById(self.ConDivID + "thead_" + t).checked;
        }
    }
    /* 註冊 鍵盤 監聽*/
    this.KeyListen = function() {
        if (document.addEventListener) {
            document.addEventListener("keydown", self.keyDown, true);
        }
        else {
            document.attachEvent("onkeydown", self.keyDown);
        }
    }
    /* 停止 鍵盤 監聽*/
    this.StopKeyListen = function() {
        if (document.removeEventListener) {
            document.removeEventListener("keydown", self.keyDown, true);
        }
        else {
            document.detachEvent("onkeydown", self.keyDown);
        }
    }
    this.rtxt=function(){
    	
    }
    /* 响應 鍵盤事件*/
    this.keyDown = function(event) {
        var e = event || window.event;
        /*if (e.keyCode == 45) {
            self.addTr(1);
        }
        if (e.keyCode == 46) {
            self.delTr(1);
        }*/
    }
    //添加行
    this.addTr = function(r) {
        r = parseInt(r, 10) || 1;
		if(r + self.Rows > 50) {
			alert("亲，总行数不能超过50行！");
			return false;
		}
        var h = 0, i = 0, tr, td, ck, sp, txt, ta, t, d = "";
        for (h = 0; h < r; h++) {
            tr = document.createElement("tr");
            self.Rows++;
            tr.id = self.ConDivID + "_" + self.Rows;
            for (i = 0; i < self.ColumnSum; i++) {
                d = self.ConDivID + "_" + self.Rows + "_" + i;
                t = self.TittleArray[i];
                td = document.createElement("td");
                td.style.width = t.w + "px";
                if (typeof (t.t) != "undefined") {
                    switch (t.t) {
                        case "cb":
                        case "checkbox":
                            ck = document.createElement("input");
                            ck.type = "checkbox";
                            ck.id = d;
                            ck.className = t.c || "";
                            td.appendChild(ck);
                            break;
                        case "span":
                            sp = document.createElement("span");
                            sp.id = d;
                            sp.className = t.c || "";
							sp.href = "javascript:void(0)";
                            txt = document.createTextNode("删除");
                            sp.appendChild(txt);
                            td.appendChild(sp);
                            break;
                        default:
                            ta = document.createElement("textarea");
                            ta.id = d;
                            ta.style.width = t.w + "px";
                            ta.className = "t_h txt";
                            if(typeof(t.ac) != "undefined")
							ta.setAttribute("sou_type",t.ac);
							if(typeof(t.vid) != "undefined")
							ta.setAttribute("vid",t.vid);
                            td.appendChild(ta);
                            break;
                    }
                }
                else {
                    ta = document.createElement("textarea");
                    ta.id = d;
                    ta.style.width = t.w + "px";
                    ta.className = "t_h txt";
                    if(typeof(t.ac) != "undefined")
					ta.setAttribute("sou_type",t.ac);
					if(typeof(t.vid) != "undefined")
					ta.setAttribute("vid",t.vid);
                    td.appendChild(ta);
                }
                tr.appendChild(td);
            }
            self.tbody.appendChild(tr);
        }
        self.actionFill();
    }
    //删除行  r 行数  d 控件ID or 行ID  s id的数组
    //如果id为空，则从最下面删除行。
    this.delTr = function(r, d, s) {
        r = parseInt(r, 10) || 1;
        d = d || "";
        s = s || [];
        var t;
		if(r > self.Rows) {
			alert("亲，删除行数不能超过总行数！");
			return false;
		}
        if (d.length !== 0) {
            t = document.getElementById(self.ConDivID + "_" + d.split("_")[1]);
            if (t !== null) {
                t.parentNode.removeChild(t);
                self.Rows--;
            }
        }
        else {
            if (s.length > 0) {
				var i = 0;
				var val = 0;
				for(var k = 0; k < r; k++)
				{
					var r2 = s[k].split("_")[1];
					var tr = document.getElementById(self.ConDivID + "_" + r2);
					var txlist = tr.getElementsByTagName("textarea");
					var tl = txlist.length;
					for (i = 0; i < tl; i++) {
						if (txlist[i].value.Trim().length > 0) {
							val = 1;
							break;
						}
					}
					if (val == 1) {
						break;
					}
				}
                if (val == 1) {
					if (confirm(Msg.d4)){
						for (i = 0; i < r; i++) {
							t = document.getElementById(self.ConDivID + "_" + s[i].split("_")[1]);
							if (t !== null) {
								t.parentNode.removeChild(t);
								self.Rows--;
							}
						}
					}
				}
				else 
				{
					for (i = 0; i < r; i++) {
						t = document.getElementById(self.ConDivID + "_" + s[i].split("_")[1]);
						if (t !== null) {
							t.parentNode.removeChild(t);
							self.Rows--;
						}
					}
				}
            }
            else {
				var i = 0;
				var val = 0;
				var rows = self.Rows;
                /*for (i = 0; i < r; i++) {
                    t = document.getElementById(self.ConDivID + "_" + self.Rows);
                    if (t !== null) {
                        t.parentNode.removeChild(t);
                        self.Rows--;
                    }
                }*/
				//已做修改--JK
				for (i = 0; i < r; i++) {
                    t = document.getElementById(self.ConDivID + "_" + rows);
					var txlist = t.getElementsByTagName("textarea");
					var tl = txlist.length;
					for (var j = 0; j < tl; j++) {
						if (txlist[j].value.Trim().length > 0) {
							val = 1;
							break;
						}
					}
					if (val == 1) {
						break;
					}
					rows--;
                }
				if (val == 1) {
					if (confirm(Msg.d4)){
						for (var j = 0; j < r; j++) {
							t = document.getElementById(self.ConDivID + "_" + self.Rows);
							if (t !== null) {
								t.parentNode.removeChild(t);
								self.Rows--;
							}
						}
					}
				} else {
					for (var j = 0; j < r; j++) {
						t = document.getElementById(self.ConDivID + "_" + self.Rows);
						if (t !== null) {
							t.parentNode.removeChild(t);
							self.Rows--;
						}
					}
				}
            }
        }
        self.rename();
		//如果删除行之后，行数为0则默认添加一行
		if(self.Rows==0)
		{
			self.addTr(1);
		}
		
		
		
		
		
		/*for (i = 1; i <= self.Rows; i++) {
            var c = parseInt(self.ColumnSum, 10) - 1;
            var ddd = self.ConDivID + "_" + i + "_" + c;
            document.getElementById(ddd).onclick = function() {
                var r = this.id.split("_")[1];
                var tr = document.getElementById(self.ConDivID + "_" + r);
                var txlist = tr.getElementsByTagName("textarea");
                var tl = txlist.length;
                for (var i = 0; i < tl; i++) {
                    if (txlist[i].value.Trim().length > 0) {
                        r = 0;
                        break;
                    }
                }
                if (r == 0) {
                    if (confirm(Msg.d2))
                        self.delTr(1, this.id);
                } else { self.delTr(1, this.id) }
            }
        }*/
		
    }
    /*全局范围内重命名*/
	
	
    this.rename = function() {
        var i = 0, h = 0, s = 0, dd = "", tdlist;
        var trlist = self.tbody.getElementsByTagName("tr");
        var tl = trlist.length;
        for (i = 0; i < tl; i++) {
            s = i + 1;
            dd = self.ConDivID + "_" + s;
            trlist[i].id = dd;
            tdlist = trlist[i].getElementsByTagName("textarea");
            for (h = 0; h < tdlist.length; h++) {
                s = tdlist[h].id.split("_")[2];
                tdlist[h].id = dd + "_" + s;
            }
            tdlist = trlist[i].getElementsByTagName("input");
            for (h = 0; h < tdlist.length; h++) {
                if (tdlist[h].type === "checkbox") {
                    s = tdlist[h].id.split("_")[2];
                    tdlist[h].id = dd + "_" + s;
                }
            }
            tdlist = trlist[i].getElementsByTagName("span");
            for (h = 0; h < tdlist.length; h++) {
                s = tdlist[h].id.split("_")[2];
                tdlist[h].id = dd + "_" + s;
            }
        }
    }
    this.clearall = function(){
    	var i = 0, y = 0, l = null;
		var val = 0;
		l = self.tbody.getElementsByTagName("textarea");
		y=l.length;
		for(i=0;i<y;i++){
			if(l[i].value.Trim().length > 0) {
				val = 1;
				break;
			}
		}
		l = self.tbody.getElementsByTagName("input");
		y=l.length;
		for(i=0;i<y;i++)
		{
			if (l[i].type === "checkbox"){
				if(l[i].checked == true) {
					val = 1;
					break;
				}
			}
		}
		if(val == 1) {
			if(confirm("确认是否清空所有？")) {
				l = self.tbody.getElementsByTagName("textarea");
				y=l.length;
				for(i=0;i<y;i++){
					l[i].value="";
				}
				l = self.tbody.getElementsByTagName("input");
				y=l.length;
				for(i=0;i<y;i++)
				{
					if (l[i].type === "checkbox"){
						l[i].checked=false;
					}
				}
				$(".del_row").siblings("span").text("");
			}
		}
    }
    this.delchecked = function() {
        var list = [], s = 0;
        for (var i = 1; i <= self.Rows; i++) {
            var d = self.ConDivID + "_" + i + "_0";
            if (document.getElementById(d) !== null)
                if (document.getElementById(d).checked === true) {
                list.push(d);
                s++;
            }
        }
		if (s == 0) {
			return false;
		}
        self.delTr(s, "", list);
    }
    /*表頭滾動*/
    this._onScroll = function() {
		window.onscroll = function() {
			var div = document.getElementById(self.ConDivID + "_TittleDiv");
			if (s_croll().scrollTop + 39 > self.H_top) {
				div.style.position = 'fixed';
				div.style.left = $(".dtHeadDiv").offset().left + "px";
				
			}
			else {
				div.style.position = 'static';
			}
		};
    }
	//备份滚动
	this._onScroll_2 = function() {
        var div = document.getElementById(self.ConDivID + "_TittleDiv");
        if (s_croll().scrollTop > self.H_top) {
            div.style.top = (s_croll().scrollTop - self.H_top) + "px";
        }
        else {
            div.style.top = "0px";
        }
        setTimeout(self._onScroll, 100);
    }
    /*創建input彈出层*/
    this._CreatDiv = function() {
        var _d = document.createElement("DIV");
        _d.setAttribute("id", "dtAutoDiv");
       	_d.style.position = "absolute";
	    _d.style.zIndex = "30";
	    _d.style.overflow = "auto";
	    _d.className = "dtAutoDiv";
	    _d.style.border = "1px solid #7f9db9";
	    document.getElementById(self.ConDivID).appendChild(_d);
        self.ac.zdiv =_d;
    }
    /* 
    *   獲取表格數據，添加進數據容器
    *   r       數據容器  cookie or textbox
        d1      如果數據容器為textbox，則d1為textbox的id
        p       是否進行提示    true or false
        d2       提示控件id，一般為span    
    */
    this.getinfo = function(r, d1, p, d2) {
        r = r || "cookie";
        if (r === "textbox") {
            d1 = d1 || "";
            if (d1.length < 2) { alert(Msg.d3); return; }
        }
        p = p || false;
        if (p === true) {
            if (d2.length < 2) { alert(Msg.d3); return; }
        }
        var i = 0, h = 0, cd = "", o, info = [], hi = [], y = 0, sum = 0;


        for (h = 1; h <= self.Rows; h++) {
            cd = self.ConDivID + "_" + h;
            y = 0;
            hi = [];
            for (i = 1; i < self.ColumnSum; i++) {
                o = document.getElementById(cd + "_" + i);
                if (o !== null) {
                    if (o.tagName === "TEXTAREA") {
                        if (o.value.Trim().length > 0) {
                            hi.push(o.value);
                            y++;
                        }
                        else {
                            hi.push("");
                        }
                    }
                    if (o.tagName === "INPUT")
                        if (o.type === "checkbox")
                        if (o.checked) {
                        hi.push("1");
                    } else {
                        hi.push("0");
                    }
                }
            }
            if (y != 0) {
                info.push(hi.join("\b"));
                sum++;
            }
        }
        if (p === true) {
            document.getElementById(d2).innerHTML = "共提交：" + sum + " 条数据";
        }
        if (r === "cookie") {
            /*var cokies = GetCookie("100allintable");
            cokies.set("value", info.join("\i"));*/
        }
        if (r === "textbox") {
            document.getElementById(d1).value = info.join("\f");
        }
    }
    /*
    	將現有數據添進表格
    */
    this.fill_table = function(r,d1){
    	r = r || "cookie";
    	if(r==="textbox"){
    		d1=d1||"";
    		if (d1.length < 2) { alert(Msg.d3); return; }
    	}
    	var i = 0, h = 0,m=0, cd = "", o, info = [], hi = [], y = 0, s = 0;
		info = document.getElementById(d1).value.split("\f");
    	y=info.length;
    	m = self.Rows - y;
        if (m < 0) {
            self.addTr(Math.abs(m));
        }
    	for(i=1;i<=y;i++)
    	{
    		cd = self.ConDivID + "_" + i;
    		hi=info[(i-1)].split("\b");
    		for(h=0;h<hi.length;h++)
    		{
    			s=h+1;
    			o=document.getElementById(cd + "_" + s);
    			if(o!==null)
    			{
    				if(o.tagName === "TEXTAREA"){
						if(hi[h]!="")
    					o.value=hi[h];
    				}
    				if (o.tagName === "INPUT")
                        if (o.type === "checkbox")
                        	if(hi[h]==0){o.checked=false}
                        	else{if(hi[h]==1)o.checked=true;}
    			}
				
    		}
    	}
    	
    }
}
/*处理className*/
function tclass(_c){
	if(typeof(_c)!="undefined"){
		return "class=\""+_c+"\"";
	}
	else{
		return "";
	}
}
function ac_str(s){
	
	var _s="";
	if(typeof(s) != "undefined")
		_s= "sou_type="+s;
	//document.getElementById("cc").innerHTML += _s+"<br/>";
	return _s;
}
var unit = 6;
function str2code(str) {
    var code = "";
    var c;
    var charLength = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        charLength = (c + "").length;
        if (charLength < unit) {
            for (j = 0; j < (unit - charLength); j++) {
                char = "0" + c;
            }
        }
        code += c;
    }
    return code;
}
function code2str(code) {
    var str = "";
    var j = 0;
    var charCode = "";
    var char = "";

    for (i = 0; i < (code.length / unit); i++) {
        charCode = code.substring(j, j + unit);
        char = String.fromCharCode(charCode);
        str += char;
        j += unit;
    }
    return str;
}
function getPosition(obj){
        var _x = 0, _y = 0;
        while(null != obj.offsetParent){
            _x += obj.offsetLeft;
            _y += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return {x:_x, y:_y};
}
function s_croll() {
    if (document.body.scrollTop != 0) {
        return { scrollLeft: document.body.scrollLeft,
            scrollTop: document.body.scrollTop
        };
    }
    else {
        return { scrollLeft: document.documentElement.scrollLeft,
            scrollTop: document.documentElement.scrollTop
        };
    }
}
function IsZH(str) {
    var re = /^[\u4e00-\u9fa5]+$/;
    if (re.test(str))
        return true;
    return false;
}
String.prototype.Trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}