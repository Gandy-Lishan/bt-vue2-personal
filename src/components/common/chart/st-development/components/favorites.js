import {config} from "../feeds/STDataFeedAccessUrl.js"
let __js_webcomponents_favorites_ = (_exports) => {

	/* global _CIQ, _timezoneJS, _SplinePlotter */
	
	var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
	
	/**
	 * Studies list web component `<cq-studies>`.
	 *
	 * Lists all studies contained in the study library, {@link CIQ.Studies.studyLibrary}.
	 *
	 * @namespace WebComponents.cq-favorites
	 * @since 5.2.0
	 *
	 * @example 
	 * <cq-menu class="ciq-menu ciq-studies collapse">
	 *     <span>Studies</span>
	 *     <cq-menu-dropdown cq-no-scroll>
	 *         <cq-study-legend cq-no-close>
	 *             <cq-section-dynamic>
	 *                 <cq-heading>Current Studies</cq-heading>
	 *                 <cq-study-legend-content>
	 *                     <template>
	 *                         <cq-item>
	 *                             <cq-label class="click-to-edit"></cq-label>
	 *                             <div class="ciq-icon ciq-close"></div>
	 *                         </cq-item>
	 *                     </template>
	 *                 </cq-study-legend-content>
	 *                 <cq-placeholder>
	 *                     <div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
	 *                 </cq-placeholder>
	 *             </cq-section-dynamic>
	 *         </cq-study-legend>
	 *         <cq-scroll>
	 *             <cq-studies>
	 *                 <cq-studies-content>
	 *                     <template>
	 *                         <cq-item>
	 *                             <cq-label></cq-label>
	 *                         </cq-item>
	 *                     </template>
	 *                 </cq-studies-content>
	 *             </cq-studies>
	 *         </cq-scroll>
	 *     </cq-menu-dropdown>
	 * </cq-menu>
	 */
	class Favorites extends CIQ.UI.ContextTag {
		disconnectedCallback() {
			console.log("kill");
			if (this.context)
				CIQ.UI.unobserveProperty(
					"studyLibraryHash",
					this.context.stx.chart,
					this.listener
				);
			super.disconnectedCallback();
		}
	
		/**
		 * Initializes and displays the list of available studies.
		 *
		 * @param {object} [params] Parameters to control initialization of the studies list.
		 * @param {object} [params.excludedStudies] A map of study names that should be excluded from
		 * 		the studies list, for example: <code>{&nbsp;"macd":&nbsp;true&nbsp;}</code>.
		 * @param {object|boolean} [params.alwaysDisplayDialog=false] If set to boolean true (not
		 * 		truthy), the study edit dialog box is automatically opened for any of the available
		 * 		studies after the study has been added to the chart. If set to boolean false, the
		 * 		study edit dialog box is not opened for any of the available studies after the study
		 * 		has been added to the chart.
		 * 		<p>If set to an object containing a map of study names and boolean values (for example,
		 * 		<code>{&nbsp;"ma":&nbsp;true,&nbsp;"AVWAP":&nbsp;true&nbsp;}</code>), the study edit
		 * 		dialog box is opened after the study has been added to the chart for studies in the
		 * 		map that have a boolean value of true but not for those that have a value of false or
		 * 		for any studies not included in the map.
		 * @param {object|boolean} [params.dialogBeforeAddingStudy=false] If set to boolean true (not
		 * 		truthy), the study edit dialog box is automatically opened for any of the available
		 * 		studies before the study is added to the chart. If set to boolean false, the study
		 * 		edit dialog box is not opened for any of the available studies before the study is
		 * 		added to the chart.
		 * 		<p>If set to an object containing a map of study names and boolean values (for example,
		 * 		<code>{&nbsp;"macd":&nbsp;true&nbsp;}</code>), the study edit dialog box is opened
		 * 		before the study is added to the chart for studies in the map that have a boolean value
		 * 		of true but not for those that have a value of false or for any studies not included
		 * 		in the map.
		 *
		 * @alias initialize
		 * @memberof WebComponents.cq-studies
		 * @since 5.2.0 The `CIQ.UI.StudyMenu` helper has been deprecated. Please call
		 * 		`document.querySelector("cq-studies").initialize()` now.
		 *
		 * @example
		 * let params = {
		 *     excludedStudies: { "macd": true },  // Exclude studies from the list of available studies.
		 *     alwaysDisplayDialog: { "ma": true },  // Show the study preferences dialog after adding studies.
		 *     dialogBeforeAddingStudy: { "rsi": true }  // Show the study preferences dialog before adding studies.
		 * };
		 * document.querySelectorAll("cq-studies").forEach(function(i) {
		 *     i.initialize(params);
		 * });
		 */
		initialize(params) {
			this.addDefaultMarkup();
			this.params = params || {};
			this.alwaysDisplayDialog = this.params.alwaysDisplayDialog || false;
			this.excludedStudies = this.params.excludedStudies || [];
			if (!this.params.template) this.params.template = "template";
			this.params.template = this.node.find(this.params.template);
			this.renderMenu();
            // this.runTask()
	
			var self = this,
				stx = this.context.stx;
			this.listener = function (obj) {
				self.renderMenu();
			};
			CIQ.UI.observeProperty("studyLibraryHash", stx.chart, this.listener);
		}
	
		setContext({ config }) {
			if (config && config.menuStudiesConfig) {
				this.initialize(Object.assign({}, config.menuStudiesConfig));
			}
		}

        async runTask(){
			await this.postajax()
			this.renderMenu();

		}
		postajax() {
			return new Promise(resolve=>{
				var server = new XMLHttpRequest();   
				// url += (url.indexOf("?") === -1 ? "?" : "&") + new Date().getTime();
				server.open("GET", config.getAllSymbols);
				console.log("fav post")
				server.setRequestHeader("Authorization", "Basic " + btoa(config.username+":"+config.password));  
				const obj = this;
				server.onload = function () {
					obj.getAllSymbols(this.status, this.responseText,obj);
				};
				server.onerror = function () {
					cb(500);
				};
				server.send();
			})
		
		};
		getAllSymbols(status,response,obj){
			if (status != 200) return;
			try {
				response = JSON.parse(response);
				// var symbols = response.payload.symbols;
				for(var i=0;i<response.length;i++)
				CIQ.Studies.studyLibrary["ST "+response[i].chart_name] = {
					inputs: { Period: 13, Overlay: false,url:response[i].url},
					outputs: {indicatorClose:"pink"}
				};
				// obj.reslust = response;
			} catch (e) {}
		}
	
		/**
		 * Creates a list of studies in a `<cq-studies-content>` element.
		 *
		 * You have the option of creating a hardcoded HTML menu and just using {@link CIQ.Studies}
		 * for processing `stxtap` attributes, or you can call this method to automatically generate
		 * the menu.
		 *
		 * @alias renderMenu
		 * @memberof WebComponents.cq-favorites
		 */
		renderMenu() {
			if (!CIQ.Studies) return;
			var stx = this.context.stx;
			var alphabetized = [];
			var sd;
            var isPass;
            var resu = JSON.parse(window.localStorage.getItem("FavoriteIndicator"))
            if (resu !== null  ){
			for (var field in CIQ.Studies.studyLibrary) {
				sd = CIQ.Studies.studyLibrary[field];
                isPass = false;
                for(var i=0;i<resu.length;i++){
                    if (resu[i].indexOf(field) !== -1){
                        isPass = true;
                        // console.log("test");
                        break;
                    }
                }
  
				if (
					!sd ||
					this.excludedStudies[field] ||
					this.excludedStudies[sd.name] ||
					sd.siqList !== undefined ||
                    !isPass
				)
					continue; // siqList = ScriptIQ entry
            
				if (!sd.name) sd.name = field; // Make sure there's always a name
				alphabetized.push(field);
			}
			alphabetized.sort(function (lhs, rhs) {
				var lsd = CIQ.Studies.studyLibrary[lhs];
				var rsd = CIQ.Studies.studyLibrary[rhs];
				if (lsd.name < rsd.name) return -1;
				if (lsd.name > rsd.name) return 1;
				return 0;
			});
        }

            // alphabetized = [];
            var resu = JSON.parse(window.localStorage.getItem("FavoriteIndicator"))
            if (resu !== null  ){
                // if (resu.length >0){
                //     resu.forEach(element => {
                //         // var str = element.split("(")[0]
                //         // str = str.substr(0,str.length-1)
                //         alphabetized.push(element)
                //     });
                // }
               
            }
           
            
			var menu = this.node;
			var self = this;
			var tapFn = function (studyName, context) {
				return function (e) {
					pickStudy(e.target, studyName);
					self.dispatchEvent(new Event("resize"));
				};
			};
	
			var contentNode = menu.find("cq-studies-content");
			while (contentNode.length > 0 && contentNode[0].firstChild) {
				contentNode[0].removeChild(contentNode[0].firstChild);
			}
	
			for (var i = 0; i < alphabetized.length; i++) {
				var menuItem = CIQ.UI.makeFromTemplate(this.params.template);
				sd = CIQ.Studies.studyLibrary[alphabetized[i]];
				menuItem.append(CIQ.translatableTextNode(stx, sd.name));
				this.makeTap(menuItem[0], tapFn(alphabetized[i], this.context));
				menu.find("cq-studies-content").append(menuItem);
			}
	
			function studyDialog(params, addWhenDone) {
				const { context } = self;
	
				if (context.config) {
					self.channelWrite(
						context.config.channels.dialog,
						{
							type: "study",
							params: Object.assign({}, params, { context, addWhenDone })
						},
						context.stx
					);
				} else {
					// legacy use when config is not available
					params.context = self.context;
					const dialog = document.querySelector("cq-study-dialog");
					dialog.addWhenDone = addWhenDone;
					dialog.open(params);
				}
			}
	
			function pickStudy(node, studyName) {
				var stx = self.context.stx;
				
				function handleSpecialCase(flag, params, addWhenDone) {
					if (flag === true) {
						studyDialog(params, addWhenDone);
						return true;
					} else if (typeof flag === "object") {
						for (var i in flag) {
							if (i == studyName && flag[i]) {
								studyDialog(params, addWhenDone);
								return true;
							}
						}
					}
				}
	
				if (
					handleSpecialCase(
						self.params.dialogBeforeAddingStudy,
						{ stx: stx, name: studyName },
						true
					)
				)
					return;
				var sd = CIQ.Studies.addStudy(stx, studyName);


                var st = CIQ.Studies.studyLibrary[studyName];
				var url = st.inputs['url']
				CIQ.stxx.loadChart(	{ symbol: CIQ.symbol, indicator: url,studyName:studyName},)

				if (Object.keys(CIQ.stxx.layout.studies).length >= 1){
					for(var sd in CIQ.stxx.layout.studies){
						sd = CIQ.stxx.layout.studies[sd]
						CIQ.Studies.removeStudy(CIQ.stxx,sd )
					}
				}
				handleSpecialCase(self.alwaysDisplayDialog, { sd: sd, stx: stx });
			}
		}
	}
	
	Favorites.markup = `
			<template>
				<cq-item></cq-item>
			</template>
			<cq-studies-content class="ciq-favorites"></cq-studies-content>
		`;
	CIQ.UI.addComponentDefinition("cq-favorites", Favorites);
	
	};


    export {__js_webcomponents_favorites_}