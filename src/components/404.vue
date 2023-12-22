<template>
	<div class="contrainer404">
        <div class='content-card'>
            <img id="img" :src="require(`../assets/404Page/${imgSrc}`)">
            <h2>You have no access right</h2>
            <p>{{mesContent}}</p>
            <el-button @click="jump">{{btnContent}}</el-button>
        </div>
	</div>
</template>
<script>

export default {
	name: '404',
	data() {
		return {
            targetPath: '',
            mesContent: '',
            btnContent: '',
            imgSrc: '',
            state: null,
            desc: '',
		}
	},
    created() {
        // this.state = this.$route.query['mes']
        // this.desc = this.$route.query['desc']
        const respond = this.$store.state.states.errorMessage404
        this.state = respond['status']
        this.desc = respond['message']

        switch(this.state){
            case 410:
                this.mesContent = `You do not have the access permission for ${this.desc}, Please upgrade your plan`
                this.btnContent = 'More Plans'
                this.imgSrc = "410.png"
                this.targetPath = 'https://sentimentrader.com/pricing';
                break;
            case '410':
                this.mesContent = `You do not have the access permission for ${this.desc}, Please upgrade your plan`
                this.btnContent = 'More Plans'
                this.imgSrc = "410.png"
                this.targetPath = 'https://sentimentrader.com/pricing';
                break;
            default:
                this.mesContent = 'You have not logged in and do not have the access permission, Please sign in first'
                this.btnContent = 'Sign in'
                 this.imgSrc = "401.png"
                this.targetPath = 'https://sentimentrader.com/login';
        }
        
    },
	methods: {
        jump(){
            window.location.href = this.targetPath;
        }
	}
}
</script>
<style lang="less" scoped>
    .contrainer404 {
        height: 100vh;
        width: 100vw;
        .content-card {
            width: 680px;
            height: 588px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            #img {
                width: 329.53px;
                height: 210px;
                margin: 100px 175px 0 175px;
            }
            h2{
                font-size: 20px;
                font-family: Open Sans-SemiBold, Open Sans;
                font-weight: 600;
                color: #647299;
                line-height: 23px;

                margin-top: 24px;
            }
            p{
                text-align: center;
                margin: 24px 150px 0 150px;
                font-size: 16px;
                font-family: Open Sans-Regular, Open Sans;
                font-weight: 400;
                color: #B7BFD7;
                line-height: 19px;
                margin-top: 24px;
            }
            button {
                margin-top: 24px;
                margin-bottom: 75px;

                width: 290px;
                height: 60px;
                background: #5C9CD1;
                border-radius: 4px 4px 4px 4px;
                opacity: 1;
                color: white;
            }
        }
    }
</style>
