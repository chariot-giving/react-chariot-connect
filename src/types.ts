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
	address: {
		line1: string
		line2: string
		city: string
		state: string
		postalCode: string
	}
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
	frequency: "ONE_TIME" | "MONTHLY"
}>

export type DonationRequestReturnType =
	| DonationRequestParams
	| false
	// biome-ignore lint/suspicious/noConfusingVoidType: This is a valid use case for void
	| void
	| Promise<DonationRequestReturnType>

/**
 * @see https://docs.givechariot.com/button-styles#creating-a-custom-theme
 */
export type CustomTheme = {
	/**
	 *  The width of the button up to `16` or `64px`
	 */
	width: number
	/**
	 * 	The height of the button up to `16` or `64px`
	 */
	height: number
	/**
	 * 	Show an extended text (Give with Donor Advised Fund) version of the DAFpay button text
	 */
	showExtendedText: boolean
}

/**
 * @see https://docs.givechariot.com/button-styles#using-a-default-theme
 */
export type ChariotTheme =
	| "DefaultTheme"
	| "LightModeTheme"
	| "LightBlueTheme"
	| "GradientTheme"

export type SuccessEvent = CustomEvent<{
	workflowSessionId: string
	grant: {
		id: string
		externalGrantId: string
		userFriendlyId: string
		amount: number
		feeAmount: number
		feeDetail: {
			total: number
			contributions: {
				name: string
				amount: number
				feeType: string
			}[]
		}
		firstName: string
		lastName: string
		email: string
		address: {
			line1: string
			line2: string
			city: string
			state: string
			country: string
			postalCode: string
		}
		fundId: string
		paymentChannel: string
		metadata: Record<string, unknown>
		status: string
		trackingId: string
		createdAt: string
		updatedAt: string
	}
}>

export type ExitEvent = CustomEvent<{
	workflowSessionId: string
	description: string
	nodeId: string
	prevNodeId: string
	reason: ExitReason
}>

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
