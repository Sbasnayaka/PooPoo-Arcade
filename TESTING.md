# Testing Two-User Pairing in Mock Mode

## Important Notes

⚠️ **Mock mode uses localStorage** which is shared across all tabs/windows in the same browser. This means:
- Both "users" must be in separate browser windows
- They share the same localStorage
- The partner detection happens via polling (every 500ms)

## Step-by-Step Testing

### Setup: Two Browser Windows

1. **Window A** (Partner):
   ```
   - Open http://localhost:3001
   - Note the generated code (e.g., "ABC-123-XYZ")
   - Keep this window OPEN and visible
   - Do NOT click FLUSH yet
   ```

2. **Window B** (Initiator):
   ```
   - Open http://localhost:3001 in a NEW WINDOW (Ctrl+N)
   - Note the different generated code (e.g., "DEF-456-GHI")
   - Enter Window A's code: "ABC-123-XYZ"
   - Click FLUSH
   ```

### Expected Behavior

After clicking FLUSH in Window B:

1. **Window B (Initiator)**:
   - ✅ Immediately redirects to lobby
   - Console shows: "📝 Mock pairing initiated"

2. **Window A (Partner)**:
   - ✅ Within 500ms, automatically redirects to lobby
   - Console shows: "🔔 Mock pairing detected - you are the partner!"
   - Both windows show the SAME lobby URL

### Troubleshooting

**Partner doesn't redirect:**
1. Check Window A is still open
2. Check browser console for errors
3. Verify both windows are on http://localhost:3001
4. Try refreshing Window A after pairing

**Both users redirect to different lobbies:**
- This means localStorage data was cleared too early
- Check the console logs
- Report the issue with console output

**"Partner code not found" error:**
- Make sure you're entering the exact code from Window A
- Codes are case-sensitive and must include dashes

---

## Console Logs to Look For

### In Initiator Window (after clicking FLUSH):
```
📝 Mock pairing initiated: {myCode: "...", partnerCode: "...", lobbyId: "..."}
💡 Tip: Open another browser window to test the partner redirect
⏳ Waiting for partner to join... (repeats every 500ms)
```

### In Partner Window (when pairing detected):
```
🔔 Mock pairing detected - you are the partner! {myCode: "...", partnerCode: "...", lobbyId: "..."}
```

---

## Alternative: Production Mode (Recommended for Real Testing)

For true two-user testing with separate devices or browsers, set up Supabase:

1. See [SETUP.md](../SETUP.md) for Supabase configuration
2. Add environment variables
3. Restart dev server
4. Test with realtime notifications (no polling delay!)

---

## Known Limitations of Mock Mode

❌ Cannot test from different devices  
❌ Cannot test with different browsers (different localStorage)  
❌ Only works with windows from same browser  
❌ Partner redirect has ~500ms delay (polling interval)  

✅ Works with multiple windows of same browser  
✅ Good for UI/UX testing  
✅ No external dependencies  
