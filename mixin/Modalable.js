/**
  ミックスインの機能
    - このコンポーネントにmodal機能をもたせる
    - 複数のmodal設置に対応
    - modal背景のクリックで閉じることができる
    - いくつかのプロパティで機能を切り替えられる
    - 親コンポーネントからの制御
      - :open.sync='variable' をつけるだけ
      - openの値をfalsyにすれば閉じられる
      - @close='handler' でcloseイベントを監視

  使い方
    - mixinする
    - コンポーネントのルートエレメントを必要とする block 要素ならOK : 基本 div
      - style : object : ModalableMixin_style : required
      - v-if  : ifState : props.openIf で制御する場合に必要
      - @click : function : clickBg : 背景クリックで閉じる処理
    - 設置例
      <template>
          <div
            v-if='ifState'
            :style='ModalableMixin_style'
            @click='clickBg'
            >

            <slot/> <!-- any your contents -->

          </div>
      </template>
    - 親コンポーネントでpropsを指定する

  interface
    - input : props
      - open : boolean : modalを開くか閉じるか
      - zIndex : Number : このmodalのz-indexを指定できる : default では指定されない
      - openIf : boolean : 開閉の際 true:v-if / false:v-show を使うか : default false
      - disabledClose : boolean : modal背景クリックでの閉じを無効化する : default false
      - modalBgColor : string : 背景色の設定 : cssのrgba()の文字列 : default rgba(0,0,0,0.5)
    - output
      - emit : update:open : false : modalのcloseイベント
      - emit : close : void : modalのcloseイベント
      - provide : function : closeModal : 子孫コンポーネントのinjectで受け取れ、this.close()への参照
*/

export default {
  provide() {
    // リアクティブな状態でproviedeする方法
    const obj = {};
    Object.defineProperty(obj,'closeModal',{enumerable:true,get:()=>this.close});
    return obj ;
  },
  props: {
    open : Boolean ,
    zIndex : Number ,
    openIf : Boolean ,
    disabledClose : Boolean ,
    modalBgColor : {
      type : String ,
      default : 'rgba(0,0,0,.5)'
    },
  },
  computed: {
    ModalableMixin_style() {
      const obj = {
        zIndex : this.zIndex ,
        position : 'fixed' ,
        top : 0 ,
        left : 0 ,
        width  : '100vw' ,
        height : '100vh' ,
        backgroundColor : this.modalBgColor ,
        display : this.open ? '' : 'none' , // v-show='open' と同じ動作
      };
      return obj ;
    },
    ifState () { return this.openIf ? this.open : true ; },
  },
  methods: {
    close() {
      this.$emit('update:open', false);
      this.$emit('close');
    },
    clickBg(e) {
      if (!this.disabledClose && e.target===this.$el) {
        this.close();
      }
    },
  },
};
