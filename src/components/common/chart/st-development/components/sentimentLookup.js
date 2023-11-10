/**
 *	2.2.0
 *	customized 'favorite' button component
 */
let __js_webcomponents_sentimentLookup_ = (_exports) => {

	/* global _CIQ, _timezoneJS, _SplinePlotter */
	
	var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
	
	/**
	 * The comparison lookup web component `<cq-sentiment-lookup>`.
	 *
	 * An encapsulation of the markup for the comparison lookup control, **+ Compare...**
	 *
	 * @namespace WebComponents.cq-comparison-sentiment
	 * @since 7.5.0
	 *
	 * @example
	 * <cq-comparison cq-marker>
	 *     <cq-menu class="cq-comparison-new" cq-focus="input">
	 *         <cq-comparison-add-label class="ciq-no-share">
	 *             <cq-comparison-plus></cq-comparison-plus><span>Compare</span><span>...</span>
	 *         </cq-comparison-add-label>
	 *         <cq-comparison-add>
	 *             <cq-comparison-lookup-frame>
	 *                 <cq-lookup cq-keystroke-claim cq-uppercase></cq-lookup>
	 *             </cq-comparison-lookup-frame>
	 *             <cq-swatch cq-no-close></cq-swatch>
	 *             <span><cq-accept-btn class="stx-btn">ADD</cq-accept-btn></span>
	 *         </cq-comparison-add>
	 *     </cq-menu>
	 * </cq-comparison>
	 */
	class SentimentLookup extends CIQ.UI.ContextTag {
		/**
		 * Adds the default markup.
		 *
		 * @alias setContext
		 * @memberof WebComponents.cq-sentiment-lookup
		 * @since 7.5.0
		 */
		setContext() {
			if (this.contextSet) return;
			this.contextSet = true;
			// this.addDefaultMarkup();
			this.initialize()
		}
		// 这个收藏夹数据初始化应该在quotefeed期间就做好了，可能重复
		async initialize(){
			// this component is created after stockdatafeed is initialized，so we initiate favorite button here
			// var favoriteSymbolList = []
        	// var favoriteIndicatorList = []
			// if(CIQ.store.state.chart.favoriteSymbolList.length>0){
			// 	favoriteSymbolList = CIQ.store.state.chart.favoriteSymbolList
			// 	favoriteIndicatorList = CIQ.store.state.chart.favoriteIndicatorList
			// }else{
			// 	const data = await CIQ.getFavorite()
			// 	try{
			// 		favoriteSymbolList = JSON.parse(data.favorite_symbol)
			// 		favoriteIndicatorList = JSON.parse(data.favorite_indicator)
			// 	}catch{}
			// }
			// CIQ.store.commit('chart/setFavoriteIndicatorList',favoriteIndicatorList)
			// CIQ.store.commit('chart/setFavoriteSymbolList',favoriteSymbolList)
			// //console.log("initialize",favoriteSymbolList)
			// try{
			// 	var div = document.querySelectorAll(".favBtnContainer")[0].querySelectorAll("button")[0]
			// 	var count=0;
			// 	for(var item in favoriteSymbolList){
			// 		if(favoriteSymbolList[item] == CIQ.symbol){
			// 			// del
			// 			div.style.cssText = "width: 188px;height: 35px;border-radius: 20px;border: 0.1rem rgb(80, 166, 252) solid;font-size: 0.6rem;font-weight:bold;background: #409EFF;color: white;font-family: Helvetica, sans-serif;cursor:pointer"
			// 			div.innerHTML = "<div><svg t='1638255076868' class='button_icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2654' width='200' height='200'><path d='M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z' p-id='2655' fill='#FFFFFF'></path></svg><span>Remove from favorites</span></div>";
			// 			div.attributes.stxtap.nodeValue="SentimentLook.delSymbolCookie()";
			// 			count++
			// 		}
			// 	}
			// 	if (count === 0){
			// 		// add
			// 		//document.querySelectorAll(".cq-comparison-new")[0].classList.remove('stxMenuActive')
			// 		div.style.cssText = "width: 188px;height: 32px;border-radius: 20px;border: 0.1rem rgb(80, 166, 252) solid;font-size: 0.6rem;font-weight:bold;background: #f8f8f9;font-family: Helvetica, sans-serif;cursor:pointer;color: #666"
			// 		div.innerHTML = "<div><svg t='1638255076868' class='button_icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2654' width='200' height='200'><path d='M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z' p-id='2655' fill='#1296db'></path></svg><span>Add to favorites</span></div>";
			// 		div.attributes.stxtap.nodeValue="SentimentLook.addSymbolCookie()";
			// 	}
			// }catch(e){
			// 	//console.error(e)
			// }

			SentimentLookup.markup = `
				<cq-comparison cq-marker>
					<cq-menu class="cq-comparison-new" cq-focus="input">
					</cq-menu>
				</cq-comparison>
			`;
			this.addDefaultMarkup();
		}
	
	}

	CIQ.UI.addComponentDefinition("cq-sentiment-lookup", SentimentLookup);
	
	};

export {__js_webcomponents_sentimentLookup_}
    