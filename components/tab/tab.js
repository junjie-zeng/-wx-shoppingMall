// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hanldItemTabsChange:function(e){
      const {index} = e.target.dataset
      this.triggerEvent('tabsItemChanges',{index})
    }
  }
})
