package org.iota.zebra.device;

import android.os.Bundle;
import android.content.pm.ActivityInfo;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.ahm.capacitor.camera.preview.CameraPreview;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(CameraPreview.class);
    }});
  }
}
