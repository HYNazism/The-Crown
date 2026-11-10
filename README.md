

---

## 7. Downloading released builds

- [Open GitHub Releases](https://github.com/HYNazism/The-Crown/releases/latest) and check the assets attached to the version you want.
- **Android:** the `.apk` asset is the direct-install package.
- **Windows:** the workflow publishes a `.exe` launcher and a portable `.zip`. The Electron `.exe` depends on its companion runtime files; use the complete portable archive rather than treating the single `.exe` as a self-contained installer.
- **Linux and macOS:** use the platform archive supplied with the release and extract its full contents before launching.
- **Web/PWA:** the web archive is a website bundle, not a desktop or mobile installer.

A successful workflow run is required before its release files are available. Device and browser compatibility can vary; check the release notes and test on the target device.
