import React, { useEffect } from "react"
import useScript from "react-script-hook"
import type {
	ChariotTheme,
	CustomTheme,
	DonationRequestReturnType,
	SuccessEvent,
	ExitEvent,
} from "./types"

const noop = () => {}

type ChariotConnectProps = {
	cid: string
	theme?: ChariotTheme | CustomTheme
	onDonationRequest?: () => DonationRequestReturnType
	onSuccess?: (e: SuccessEvent) => void
	onExit?: (e: ExitEvent) => void
	disabled?: boolean
}

function ChariotConnect(props: ChariotConnectProps) {
	const {
		cid,
		theme = "DefaultTheme",
		onDonationRequest = noop,
		onSuccess = noop,
		onExit = noop,
		disabled = false,
	} = props

	const [loading, error] = useScript({
		src: "https://cdn.givechariot.com/chariot-connect.umd.js",
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: Maintaining the original behavior
	useEffect(() => {
		if (loading) {
			return
		}
		if (error) {
			console.log("Error loading chariot connect.")
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

	return <div id="connectContainer" />
}

export default ChariotConnect
