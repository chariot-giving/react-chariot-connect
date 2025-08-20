import React, { useEffect } from "react"
import useScript from "react-script-hook"
import type {
	ChariotTheme,
	CustomTheme,
	DonationRequestReturnType,
	SuccessEvent,
	ExitEvent,
	GrantIntent,
	Grant,
	RecurringGrant,
	ChariotError,
} from "./types"

const noop = () => {}

type ChariotConnectProps = {
	cid: string
	theme?: ChariotTheme | CustomTheme
	onDonationRequest?: () => DonationRequestReturnType
	onSuccess?: (e: SuccessEvent) => void
	onExit?: (e: ExitEvent) => void
	onError?: (e: ChariotError) => void
	disabled?: boolean
	loadingComponent?: React.ReactNode;
}

function ChariotConnect(props: ChariotConnectProps) {
	const {
		cid,
		theme = "DefaultTheme",
		onDonationRequest = noop,
		onSuccess = noop,
		onExit = noop,
		onError = noop,
		disabled = false,
		loadingComponent,
	} = props

	const [loading, error] = useScript({
		src: "https://cdn.givechariot.com/chariot-connect.umd.js",
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: Maintaining the original behavior
	useEffect(() => {
		if (error) {
			onError?.({
				type: "SCRIPT_LOAD_ERROR",
				message: "Failed to load Chariot Connect script",
				sourceEvent: error,
			})
			return
		}

		if (loading) {
			return
		}

		// biome-ignore lint/suspicious/noExplicitAny: Dynamic properties exist on the element
		const connect = document.createElement("chariot-connect") as any
		connect.setAttribute("cid", cid)
		connect.setAttribute(
			"theme",
			typeof theme === "string" ? theme : "customTheme",
		)
		if (disabled) {
			connect.setAttribute("disabled", "")
		}

		connect.addEventListener("CHARIOT_INIT", () => {
			connect.onDonationRequest(onDonationRequest)
			connect.registerTheme("customTheme", theme)
		})

		connect.addEventListener("CHARIOT_SUCCESS", onSuccess)
		connect.addEventListener("CHARIOT_EXIT", onExit)

		const connectContainer = document.getElementById("connectContainer")
		connectContainer?.appendChild(connect)

		return () => {
			connectContainer?.removeChild(connect)
		}
	}, [onDonationRequest, loading, error])

	return (<>
		{loading && loadingComponent ? (
			loadingComponent
		) : <div>Loading...</div>}
		{error ? (
			<div className="chariot-error">
				{error.message || "An error occurred while loading Chariot Connect."}
			</div>
		) : null}
	<div id="connectContainer" />
	</>)
}

export function isGrant(e: CustomEvent["detail"]): e is Grant {
	return typeof e === "object" && "grant" in e
}

export function isRecurringGrant(
	e: CustomEvent["detail"],
): e is RecurringGrant {
	return typeof e === "object" && "recurringGrant" in e
}

export function isGrantIntent(e: CustomEvent["detail"]): e is GrantIntent {
	return typeof e === "object" && "grantIntent" in e
}

export function isRecurringGrantIntent(
	e: CustomEvent["detail"],
): e is GrantIntent {
	return typeof e === "object" && "recurringGrantIntent" in e
}

export default ChariotConnect
