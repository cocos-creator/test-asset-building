cc.Class({
    extends: cc.Component,

    properties: {
        output: cc.Label,
        
        asset: cc.SpriteFrame,
        rawAsset: cc.Texture2D,
        mainAsset: cc.SpriteAtlas,
        subAsset: cc.Sprite,
        
        builtinAsset: cc.Sprite,
        builtinRawAsset: cc.ParticleSystem,
        
        resourcesAsset: cc.Animation,
        resourcesRawAsset: cc.Texture2D,
        resourcesMainAsset: cc.SpriteAtlas,
        resourcesSubAsset: cc.Sprite,
        
        prefabToTestRefFromRes: cc.Prefab,
        
        urlResAsset: "",
        previewAnimation: cc.Animation,
        urlResRawAsset: "",
        previewSprite: cc.Sprite,
        urlResMainAsset: "",
        urlResSubAsset: "",
        previewSprite2: cc.Sprite,
    },

    // use this for initialization
    start () {
        setTimeout(() => {
            this.output.string = "";
            this.loadByReference(() => {
                this.loadByUrl(() => {
                    this.log('------------------------ Finished \uD83D\uDE02 ------------------------');
                });
            });
        }, 200);
    },

    loadByReference (done) {
        this.log('Test (raw) assets loaded by static reference:');
        
        this.logResult('asset (SpriteFrame)', this.asset instanceof cc.SpriteFrame);
        cc.loader.load(this.rawAsset, (err, tex) => {
            this.logResult('raw asset (Texture2D)', tex instanceof cc.Texture2D);
            this.logResult('main asset (SpriteAtlas)', this.mainAsset instanceof cc.SpriteAtlas);
            this.logResult('sub asset (SpriteFrame)', this.subAsset.spriteFrame instanceof cc.SpriteFrame);

            var builtinSF = this.builtinAsset.spriteFrame;
            var builtinSFLoaded = builtinSF instanceof cc.SpriteFrame;
            this.logResult('builtin asset (SpriteFrame)', builtinSFLoaded);
            if (builtinSFLoaded) {
                this.logResult('builtin raw asset (Texture2D)', builtinSF.getTexture() instanceof cc.Texture2D);
            }

            this.logResult('asset in resources (AnimationClip)', this.resourcesAsset.defaultClip instanceof cc.AnimationClip);
            this.logResult('main asset in resources (SpriteAtlas)', this.resourcesMainAsset instanceof cc.SpriteAtlas);
            this.logResult('sub asset in resources (SpriteFrame)', this.resourcesSubAsset.spriteFrame instanceof cc.SpriteFrame);
            
            cc.loader.load(this.resourcesRawAsset, (err, tex) => {
                this.logResult('raw asset in resources (Texture2D)', tex instanceof cc.Texture2D);

                this.log('Test (raw) assets referenced by resources but not placed in resources:');

                var assetUser = cc.instantiate(this.prefabToTestRefFromRes).getComponent("Asset User");
                this.logResult('asset (SpriteFrame)', assetUser.asset instanceof cc.SpriteFrame);
                cc.loader.load(assetUser.rawAsset, (err, tex) => {
                    this.logResult('raw asset (Texture2D)', tex instanceof cc.Texture2D);
                    
                    done();
                });
            });
        });
    },
    
    loadByUrl (done) {
        this.log('Test resources (raw) assets loaded by dynamic url:');

        cc.loader.load(this.urlResAsset, (err, clip) => {
            this.logResult('asset (AnimationClip)', clip instanceof cc.AnimationClip);
            if (clip) {
                this.previewAnimation.addClip(clip, 'test');
                this.previewAnimation.play('test');
            }

            cc.loader.load(this.urlResRawAsset, (err, tex) => {
                this.logResult('raw asset (Texture2D)', tex instanceof cc.Texture2D);
                if (tex) {
                    var sp = new cc.SpriteFrame(tex);
                    this.previewSprite.spriteFrame = sp;
                }

                cc.loader.load(this.urlResMainAsset, (err, atlas) => {
                    this.logResult('main asset (SpriteAtlas)', atlas instanceof cc.SpriteAtlas);

                    cc.loader.load(this.urlResSubAsset, (err, spriteFrame) => {
                        this.logResult('sub asset (SpriteFrame)', spriteFrame instanceof cc.SpriteFrame);
                        if (spriteFrame) {
                            this.previewSprite2.spriteFrame = spriteFrame;
                        }
                        done();
                    });
                });
            });
        });
    },
    
    logResult (name, succeed) {
        if (succeed) {
            this.log(`  ${name} - loaded \u2705`);
        }
        else {
            this.log(`[ERROR] ${name} not loaded \u274C`);
        }
    },
    
    log (msg) {
        var str = this.output.string;
        if (str) {
            str += ('\n' + msg);
        }
        else {
            str = msg;
        }
        this.output.string = str;        
    }
});
