// Getters
export const GET_LOGIN_ENDPOINT = 'getLoginEndpoint'
export const GET_USER_ENDPOINT = 'getUserEndpoint'
export const GET_IS_LOGGED_IN = 'getIsLoggedIn'
export const GET_LOGOUT_ENDPOINT = 'getLogoutEndpoint'
export const GET_URL_FACTORY = 'getUrlFactory'
export const GET_HTTP_CONFIG = 'getHttpConfig'
export const GET_BACKEND_URL = 'getBackendUrl'
export const GET_BASE_URL = 'getBaseUrl'
export const GET_S3_URL = 'getS3Url'
export const GET_LATEST_ROUTE = 'getLatestRoute'
export const GET_PREVIOUS_ROUTE = 'getPreviousRoute'
export const GET_DOES_USER_HAVE_SESSION = 'getDoesUserHaveSession'
export const GET_CURRENT_USER = 'getCurrentUser'

// Mutations
export const SET_SESSION_TOKEN = 'setSessionToken'
export const LOAD_SESSION_FROM_COOKIE = 'loadSessionFromCookie'
export const SET_APP_INITIALIZATION_STATE = 'setAppInitializationState'
export const SET_DID_SESSION_VALIDATION_FAIL = 'setDidSessionValidationFail'
export const SET_LOAD_USER_STATE = 'setLoadUserState'
export const SET_INIT_USER_MODULE_STATE = 'setInitUserModuleState'
export const SET_INIT_AUTHENTICATED_USER_MODULE_STATE = 'setInitAuthenticatedUserModuleState'
export const SET_USER_SIGNUP_STATE = 'setUserSignUpState'
export const SET_LOGIN_STATE = 'setLoginState'
export const SET_CURRENT_USER_STATE = 'setCurrentUserState'
export const SET_CHANGE_PASSWORD_STATE = 'setChangePasswordState'
export const PUSH_TO_SESSION_HISTORY = 'pushToSessionHistory'
export const SET_SCROLL_STATE_BY_KEY = 'setWindowScrollEvent'
export const SET_CLIENT_SIDE_INIT_STATE = 'setAppClientSideInitState'
export const SET_INIT_ADMIN_MODULE_STATE = 'setInitAdminModuleState'

// Actions
export const A_ON_APP_CREATED = 'actionOnAppCreated'
export const A_INIT_USER_MODULE = 'actionInitUserModule'
export const A_INIT_AUTHENTICATED_USER_MODULE = 'actionInitAuthenticatedUserModule'
export const A_LOAD_CURRENT_USER = 'actionLoadCurrentUser'
export const A_SET_SESSION_TOKEN_COOKIE_FROM_REQUEST = 'actionSetSessionTokenCookieFromRequest'
export const A_SET_SESSION_TOKEN = 'actionSetSessionToken'
export const A_LOAD_SESSION_TOKEN_COOKIE_FROM_BROWSER = 'actionLoadSessionTokenCookieFromBrowser'
export const APP_CLIENT_SIDE_INIT = 'appClientSideInit'
export const A_AFTER_EACH_ROUTE = 'actionAfterEachRoute'
export const A_BEFORE_EACH_ROUTE = 'actionBeforeEachRoute'
export const A_ON_DOCUMENT_SCROLL = 'actionOnDocumentScroll'
export const A_SET_DOCUMENT_SCROLL = 'actionSetDocumentScroll'
export const A_SIGN_UP = 'actionSignUp'
export const A_SIGN_OUT = 'actionSignOut'
export const A_LOGIN = 'actionLogin'
export const A_CHANGE_PASSWORD = 'actionChangePassword'
export const A_REQUEST_PASSWORD_RESET_EMAIL = 'actionRequestResetPasswordEmail'
export const A_RESET_PASSWORD_SET_NEW_PASSWORD = 'actionRequestSetNewPassword'
export const LOAD_USER = 'loadUser'
export const A_INIT_ADMIN_MODULE = 'actionInitAdminModule'

// Loading States
export const LOADING_PRISTINE = 0
export const LOADING_STARTED = 1
export const LOADING_COMPLETED_SUCCESS = 2
export const LOADING_COMPLETED_FAILURE = 3

// Route names
export const ROUTE_ROOT = 'index'
export const ROUTE_HOME = 'home'
export const ROUTE_LOGIN = 'login'
export const ROUTE_SIGNUP = 'signup'
export const ROUTE_TERMS = 'terms'
export const ROUTE_PRIVACY = 'privacy'
export const ROUTE_ADMIN = 'admin'

// Meta Tags
export const META_HID_DESCRIPTION = 'description'
export const META_DESCRIPTION = 'description'
export const META_OG_TITLE = 'og:title'
export const META_HID_OG_TITLE = 'og-title'
export const META_HID_OG_IMAGE = 'og-image'
export const META_OG_IMAGE = 'og:image'
export const META_HID_OG_DESCRIPTION = 'og-description'
export const META_OG_DESCRIPTION = 'og:description'

export const COOKIE_KEY_SESSION_TOKEN = 'template-session-token'

export const BACKEND_MAX_INTEGER = 2147483647

export const ERROR_MESSAGE_AXIOS_401 = 'Request failed with status code 401'
export const ERROR_MESSAGE_EMAIL_ALREADY_EXISTS = 'Email already exists'
export const ERROR_MESSAGE_GENERIC_SIGNUP_ERROR = 'Generic signup error'

export const EVENT_NAME_HIDE = 'hide'
export const EVENT_NAME_CLICK = 'click'
export const EVENT_NAME_CHANGE = 'change'
export const EVENT_NAME_INPUT = 'input'
export const EVENT_NAME_SUBMIT = 'submit'
export const EVENT_NAME_RESIZE = 'resize'

export const DATE_FORMAT_DEFAULT_INPUT = 'yyyy-MM-dd'

// Render Store Module
export const GET_IS_SCREEN_SIZE_DESKTOP = 'getIsScreenSizeDesktop'
export const GET_IS_SCREEN_SIZE_TABLET = 'getIsScreenSizeTablet'
export const GET_IS_SCREEN_SIZE_MOBILE = 'getIsScreenSizeMobile'

export const SET_APP_WIDTH = 'setAppWidth'
