'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-6531dc2e2e997f4099e7dadeb17f04e591ac8a18a2e0fab3d0bea9ae890b097f75abcc6b62c348b6d9476c60ae18bdea6c463518d5aa59091101e030ffb2279c"' : 'data-bs-target="#xs-components-links-module-AppModule-6531dc2e2e997f4099e7dadeb17f04e591ac8a18a2e0fab3d0bea9ae890b097f75abcc6b62c348b6d9476c60ae18bdea6c463518d5aa59091101e030ffb2279c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6531dc2e2e997f4099e7dadeb17f04e591ac8a18a2e0fab3d0bea9ae890b097f75abcc6b62c348b6d9476c60ae18bdea6c463518d5aa59091101e030ffb2279c"' :
                                            'id="xs-components-links-module-AppModule-6531dc2e2e997f4099e7dadeb17f04e591ac8a18a2e0fab3d0bea9ae890b097f75abcc6b62c348b6d9476c60ae18bdea6c463518d5aa59091101e030ffb2279c"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AuthModule-e926e9c7befdb8aa5d25ee2193b2aa6de09a16fa7ac6f30bfbed1290abf9e5665f9b490499edf9d8988aeb2c94d825ae43a0baccc28664de0bc6ced3508debc4"' : 'data-bs-target="#xs-components-links-module-AuthModule-e926e9c7befdb8aa5d25ee2193b2aa6de09a16fa7ac6f30bfbed1290abf9e5665f9b490499edf9d8988aeb2c94d825ae43a0baccc28664de0bc6ced3508debc4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-e926e9c7befdb8aa5d25ee2193b2aa6de09a16fa7ac6f30bfbed1290abf9e5665f9b490499edf9d8988aeb2c94d825ae43a0baccc28664de0bc6ced3508debc4"' :
                                            'id="xs-components-links-module-AuthModule-e926e9c7befdb8aa5d25ee2193b2aa6de09a16fa7ac6f30bfbed1290abf9e5665f9b490499edf9d8988aeb2c94d825ae43a0baccc28664de0bc6ced3508debc4"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MainPageModule.html" data-type="entity-link" >MainPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MainPageModule-6f7525d2fdea2926f5295a6c6fd89a422b20bd454d45159e0c3908cd64ad91d9c3b3f8a3aa7f78ede53ad3aed4061073c83f60fe410230da9e5e130d23292938"' : 'data-bs-target="#xs-components-links-module-MainPageModule-6f7525d2fdea2926f5295a6c6fd89a422b20bd454d45159e0c3908cd64ad91d9c3b3f8a3aa7f78ede53ad3aed4061073c83f60fe410230da9e5e130d23292938"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MainPageModule-6f7525d2fdea2926f5295a6c6fd89a422b20bd454d45159e0c3908cd64ad91d9c3b3f8a3aa7f78ede53ad3aed4061073c83f60fe410230da9e5e130d23292938"' :
                                            'id="xs-components-links-module-MainPageModule-6f7525d2fdea2926f5295a6c6fd89a422b20bd454d45159e0c3908cd64ad91d9c3b3f8a3aa7f78ede53ad3aed4061073c83f60fe410230da9e5e130d23292938"' }>
                                            <li class="link">
                                                <a href="components/MainPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainPageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MainPageRoutingModule.html" data-type="entity-link" >MainPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' : 'data-bs-target="#xs-components-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' :
                                            'id="xs-components-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' }>
                                            <li class="link">
                                                <a href="components/ConfirmationDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmationDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' : 'data-bs-target="#xs-directives-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' :
                                        'id="xs-directives-links-module-MaterialModule-f04ed7c8c905c7b4c1dd0d3a93f5baba08ab3c52f48453ad2bfc994d4732c6c9476f9a67afe034c03e0ec905185c054de6ac1868611c514c2638e7adc7d3a09b"' }>
                                        <li class="link">
                                            <a href="directives/ChangeBorderOnClickDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChangeBorderOnClickDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/WaitCursorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WaitCursorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MusicalBandsModule.html" data-type="entity-link" >MusicalBandsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MusicalBandsModule-d78828a7e46d5cd68dc6045c0efb605ba0d54e5c95b36fc153c0db44f63ec6ab76675858e1073a1d092667c235e4f4ffa876d71b1c17328abd9b3ecf5786de00"' : 'data-bs-target="#xs-components-links-module-MusicalBandsModule-d78828a7e46d5cd68dc6045c0efb605ba0d54e5c95b36fc153c0db44f63ec6ab76675858e1073a1d092667c235e4f4ffa876d71b1c17328abd9b3ecf5786de00"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MusicalBandsModule-d78828a7e46d5cd68dc6045c0efb605ba0d54e5c95b36fc153c0db44f63ec6ab76675858e1073a1d092667c235e4f4ffa876d71b1c17328abd9b3ecf5786de00"' :
                                            'id="xs-components-links-module-MusicalBandsModule-d78828a7e46d5cd68dc6045c0efb605ba0d54e5c95b36fc153c0db44f63ec6ab76675858e1073a1d092667c235e4f4ffa876d71b1c17328abd9b3ecf5786de00"' }>
                                            <li class="link">
                                                <a href="components/BandFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BandFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BandInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BandInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BandMembersSurveyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BandMembersSurveyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilesModule.html" data-type="entity-link" >ProfilesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ProfilesModule-f86039ce3954fe8942a3ff4c06f1867fac287499605c5d35e41a63fc93983135f7dfe266c14b319c3b32a778e68364df9df839d70e288f03365d98b46ba3ada3"' : 'data-bs-target="#xs-components-links-module-ProfilesModule-f86039ce3954fe8942a3ff4c06f1867fac287499605c5d35e41a63fc93983135f7dfe266c14b319c3b32a778e68364df9df839d70e288f03365d98b46ba3ada3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfilesModule-f86039ce3954fe8942a3ff4c06f1867fac287499605c5d35e41a63fc93983135f7dfe266c14b319c3b32a778e68364df9df839d70e288f03365d98b46ba3ada3"' :
                                            'id="xs-components-links-module-ProfilesModule-f86039ce3954fe8942a3ff4c06f1867fac287499605c5d35e41a63fc93983135f7dfe266c14b319c3b32a778e68364df9df839d70e288f03365d98b46ba3ada3"' }>
                                            <li class="link">
                                                <a href="components/UserProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserProfileComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UsersModule-645c32b1b39230c112e27bfecf979432bb83479f39cf963ee141311b2bd7b2d4f2baab26a7cdfb67457ca25855f48f5c462b08f1f4638dd97bc642beacd6443e"' : 'data-bs-target="#xs-components-links-module-UsersModule-645c32b1b39230c112e27bfecf979432bb83479f39cf963ee141311b2bd7b2d4f2baab26a7cdfb67457ca25855f48f5c462b08f1f4638dd97bc642beacd6443e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersModule-645c32b1b39230c112e27bfecf979432bb83479f39cf963ee141311b2bd7b2d4f2baab26a7cdfb67457ca25855f48f5c462b08f1f4638dd97bc642beacd6443e"' :
                                            'id="xs-components-links-module-UsersModule-645c32b1b39230c112e27bfecf979432bb83479f39cf963ee141311b2bd7b2d4f2baab26a7cdfb67457ca25855f48f5c462b08f1f4638dd97bc642beacd6443e"' }>
                                            <li class="link">
                                                <a href="components/AccountInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserProfileFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserProfileFormComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersRoutingModule.html" data-type="entity-link" >UsersRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ConfirmationDialogModel.html" data-type="entity-link" >ConfirmationDialogModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomValidators.html" data-type="entity-link" >CustomValidators</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MusicalBandsService.html" data-type="entity-link" >MusicalBandsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserProfilesService.html" data-type="entity-link" >UserProfilesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptorService.html" data-type="entity-link" >AuthInterceptorService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CanDeactivateGuard.html" data-type="entity-link" >CanDeactivateGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BandFormData.html" data-type="entity-link" >BandFormData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BandHQ.html" data-type="entity-link" >BandHQ</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BandMembersSurvey.html" data-type="entity-link" >BandMembersSurvey</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BandUserMatch.html" data-type="entity-link" >BandUserMatch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CanDeactivateComponent.html" data-type="entity-link" >CanDeactivateComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangePassword.html" data-type="entity-link" >ChangePassword</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Invitation.html" data-type="entity-link" >Invitation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MusicalBand.html" data-type="entity-link" >MusicalBand</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterUser.html" data-type="entity-link" >RegisterUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyFormData.html" data-type="entity-link" >SurveyFormData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyResult.html" data-type="entity-link" >SurveyResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAddress.html" data-type="entity-link" >UserAddress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserProfile.html" data-type="entity-link" >UserProfile</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});