//
//  ContentView.swift
//  AmplifyCognitoAuthDemo
//
//  Created by Mario Castro Squella on 20-08-20.
//  Copyright © 2020 Technology-Science. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var auth = AuthService()
    
    init() {
        auth.checkSessionStatus()
        auth.observeAuthEvents()
    }
    
    var body: some View {
        ZStack {
            if auth.isSignedIn {
                SessionView()
                    .environmentObject(auth)
            } else {
                SignInView()
                    .environmentObject(auth)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
