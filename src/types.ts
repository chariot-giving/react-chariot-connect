/**
 * Chariot accepts information before it launches a Connect session. Pre-populating this information is completely optional, however you can use metadata if you want to associate the payment or session with any data in your system.
 * @see https://docs.givechariot.com/integrating-connect#pre-populate-data-into-your-connect-session
 */
export type DonationRequestParams = Partial<{
	/**
	 * The donation amount in cents. e.g., for a $20 donation, enter 2000.
	 */
	amount: number
	/**
	 * The donor’s first name
	 */
	firstName: string
	/**
	 * The donor’s last name
	 */
	lastName: string
	/**
	 * The donor’s email address. Must be in email format
	 */
	email: string
	/**
	 * The donor’s phone number. Please provide the phone number with the country code and without special characters
	 */
	phone: string
	/**
	 * A note the donor wants to send to the nonprofit
	 */
	note: string
	/**
	 * Indicates if this donation should be sent anonymously (default: false)
	 */
	anonymous: boolean
	/**
	 * The designation to include on the grant. If this is left blank, “Where needed most” will be used. Note that including a custom designation may cause the grant approval process to take longer. Designations over 100 characters will be truncated.
	 */
	designation: string
	/**
	 * The donor’s address: line1, line2, city, state, postalCode
	 */
	address: Address
	/**
	 * An object with a set of name-value pairs. You can use this object to include any miscellaneous information you want to tie to the workflow session.
	 */
	metadata: Record<string, unknown>
	/**
	 * The ID of the preselected DAF provider.
	 */
	fundId: string
	/**
	 * The recurring frequency of the DAF grant (if it’s a recurring gift). This parameter allows the following possible enum values: ONE_TIME, MONTHLY. If not provided, the grant will default to a ONE_TIME grant. For more information on recurring donations, please see the section below
	 */
	frequency: Frequency
}>

export type ChariotErrorType = "SCRIPT_LOAD_ERROR"

export type ChariotError = {
	type: ChariotErrorType
	message: string
	sourceEvent?: Event
}

export type DonationRequestReturnType =
	| DonationRequestParams
	| false
	// biome-ignore lint/suspicious/noConfusingVoidType: This is a valid use case for void
	| void
	| Promise<DonationRequestReturnType>

export type SuccessEvent = CustomEvent<
	Grant | RecurringGrant | GrantIntent | RecurringGrantIntent
>

export type Grant = {
	workflowSessionId: string
	grant: {
		id: string
		userFriendlyId: string
		trackingId: string | null
		workflowSessionId: string
		fundId: string
		externalGrantId?: string
		createdAt: string
		updatedAt: string
		amount: number
		feeAmount: number
		feeDetail: FeeDetail
		coversFees: boolean
		status: string
		metadata: Record<string, unknown> | null
		firstName?: string
		lastName?: string
		email?: string
		phone?: string
		address?: Address
		note?: string
		paymentChannel: PaymentChannel
	}
}

export type RecurringGrant = {
	workflowSessionId: string
	recurringGrant: {
		id: string
		userFriendlyId: string
		trackingId?: string
		workflowSessionId: string
		fundId: string
		externalRecurringGrantId?: string
		createdAt: string
		updatedAt: string
		amount: number
		feeDetail?: FeeDetail
		frequency: Frequency
		firstName?: string
		lastName?: string
		email?: string
		phone?: string
		address?: Address
		note?: string
	}
}

export type GrantIntent = {
	workflowSessionId: string
	grantIntent: {
		userFriendlyId: string
		trackingId: string
		fundId: string
		amount: number
		metadata: Record<string, unknown> | null
	}
}

export type RecurringGrantIntent = {
	workflowSessionId: string
	recurringGrantIntent: {
		userFriendlyId: string
		trackingId: string
		fundId: string
		amount: number
		frequency: Frequency
		metadata: Record<string, unknown> | null
	}
}

export type ExitEvent = CustomEvent<{
	workflowSessionId: string
	description: string
	nodeId: string
	prevNodeId: string
	reason: ExitReason
}>

type FeeDetail = {
	total: number
	contributions: FeeDetailContribution[]
}

type FeeDetailContribution = {
	name: string
	amount: number
	feeType: FeeType
}

type Address = {
	line1: string
	line2: string
	city: string
	state: string
	country: string
	postalCode: string
}

type PaymentChannel = "dafpay_network" | "direct" | "offline"

type FeeType = "chariot" | "daf" | "fundraising_application"

/**
 * @see https://docs.givechariot.com/button-styles#creating-a-custom-theme
 */
export type CustomTheme = {
	/**
	 *  The width of the button.
	 *  Must be at least 9 or 36px and up to 16 or 64px
	 */
	width: string
	/**
	 * 	The height of the button.
	 *  Must be at least 9 or 36px up to 12 or 48px
	 */
	height: string
	/**
	 * 	Show an extended text (Give with Donor Advised Fund) version of the DAFpay button text
	 */
	showExtendedText: boolean
}

/**
 * @see https://docs.givechariot.com/guides/dafpay/button-styles#using-a-default-theme
 */
export type ChariotTheme =
	| "DefaultTheme"
	| "LightModeTheme"
	| "LightBlueTheme"
	| "GradientTheme"

type Frequency = "ONE_TIME" | "MONTHLY"

/**
 * The reason the user exited the flow
 * @see https://docs.givechariot.com/integrating-connect#exit-reasons
 */
export type ExitReason =
	| "USER_EXIT"
	| "UNINTEGRATED_DAF"
	| "UNINTEGRATED_GRANT_CONFIRMED"
	| "CID_NOT_FOUND"
	| "INELIGIBLE_ORGANIZATION"
	| "CREDENTIALS_ERROR"
	| "INVALID_CARD"
	| "TFA_ERROR"
	| "ZERO_AMOUNT"
	| "SERVICE_DEACTIVATED"
	| "ACCESS_RESTRICTED"
	| "EIN_NOT_FOUND"
	| "CONNECTION_FAILED"
	| "SESSION_NOT_FOUND"
	| "CUSTOM_ERROR"
	| "INTERNAL_ERROR"
	| "INSTITUTION_DOWN_ERROR"
	| "NO_CHARITABLE_ACCOUNTS"
	| "INVALID_PRESELECTED_DAF"
	| "INACTIVE_CARD"
