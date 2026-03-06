import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

const ScrollToTop = () => {
    const { pathname } = useLocation()

    useLayoutEffect(() => {
        if (typeof window === "undefined") {
            return
        }

        const scrollToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" })
            document.documentElement?.scrollTo?.({ top: 0, left: 0, behavior: "auto" })
            document.body?.scrollTo?.({ top: 0, left: 0, behavior: "auto" })
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        }

        if (typeof window.requestAnimationFrame === "function") {
            window.requestAnimationFrame(scrollToTop)
        } else {
            scrollToTop()
        }
    }, [pathname])

    return null
}

export default ScrollToTop
