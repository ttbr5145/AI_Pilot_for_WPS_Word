# 瀹夎璇存槑锛堢粰涓嶄細鐢佃剳鐨勬湅鍙嬶級

1. 鎶婃敹鍒扮殑鏁翠釜鏂囦欢澶癸紙渚嬪 `wps-gift`锛夎В鍘嬪埌妗岄潰鎴栦换鎰忎綅缃€?
2. 鍙屽嚮 `install.ps1` 鍙兘浼氳闃绘锛岃鎸変笅闈换涓€鏂瑰紡杩愯锛?

   - 鎺ㄨ崘锛堢畝鍗曪級锛氫互绠＄悊鍛樿韩浠芥墦寮€ PowerShell锛岀劧鍚庤繍琛岋細

     ```powershell
     PowerShell -ExecutionPolicy Bypass -File .\install.ps1
     ```

   - 濡傛灉涓嶆効浣跨敤绠＄悊鍛樻潈闄愶紝鐩存帴鍙抽敭 `install.ps1` -> 鐢?PowerShell 杩愯锛堟垨鍦ㄨ祫婧愮鐞嗗櫒鍦板潃鏍忚緭鍏?`powershell -ExecutionPolicy Bypass -File .\install.ps1`锛夈€?

3. 瀹夎鑴氭湰浼氬畬鎴愶細
   - 灏嗘墿灞曟枃浠跺鍒跺埌 `%LocalAppData%\WPSAddins\AI_Pilot_for_WPS_Word`锛堥粯璁わ級锛?
   - 鍦ㄢ€滃綋鍓嶇敤鎴封€濈殑鍙椾俊浠绘牴璇佷功涓嚜鍔ㄦ坊鍔犺嚜绛惧悕璇佷功锛屼互閬垮厤 WPS 鐨勫畨鍏ㄦ彁绀猴紱
   - 鎵撳紑鍖呭惈 `manifest.xml` 鐨勬枃浠跺す骞堕€変腑瀹冿紝鏂逛究鍚庣画鍦?WPS 涓姞杞姐€?

4. 鎵撳紑 WPS -> 宸ュ叿 -> 鍔犺浇椤?-> XML 鎵╁睍鍖咃紝閫夋嫨涓婁竴姝ヤ腑鏄剧ず鐨?`manifest.xml` 骞跺姞杞藉嵆鍙娇鐢ㄦ彃浠躲€?

5. 濡傛灉瑕佸嵏杞斤紝璇峰弻鍑?`uninstall.ps1`锛堟垨浠ュ悓鏍锋柟寮忚繍琛?PowerShell 鍛戒护锛夛細

   ```powershell
   PowerShell -ExecutionPolicy Bypass -File .\uninstall.ps1
   ```

娉ㄦ剰锛?
- 鑷鍚嶈瘉涔︿粎鐢ㄤ簬寮€鍙戝拰灏忚寖鍥村垎鍙戙€傚鏋滀綘鎵撶畻鍏紑鍙戝竷鎴栧ぇ瑙勬ā鍒嗗彂锛岃璐拱鍙椾俊浠荤殑浠ｇ爜绛惧悕璇佷功骞剁鍚?`manifest.xml`銆?
- 濡傛灉瀹夎杩囩▼涓嚭鐜版彁绀猴紝璇锋妸鎻愮ず鎴浘鍙戠粰鎴戯紝鎴戝府浣犺瘖鏂€?
