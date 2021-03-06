# Reference Vorto Models from your DSL 

This tutorial shows you, how you can reference Vorto Models from your custom Xtext DSL Eclipse Plugins.

In this demo, we are going to create a DSL with which you can describe an IoT system aggregating Vorto Information Models.

![](images/vortodslintegration.png)

## Prerequisites

* Install Eclipse IDE 2018-12 for Java and DSL Developers
	* [Windows](https://www.eclipse.org/downloads/download.php?file=/technology/epp/downloads/release/2018-12/R/eclipse-dsl-2018-12-R-win32-x86_64.zip)
	* [MacOS](https://www.eclipse.org/downloads/download.php?file=/technology/epp/downloads/release/2018-12/R/eclipse-dsl-2018-12-R-macosx-cocoa-x86_64.dmg)
	* [Linux](https://www.eclipse.org/downloads/download.php?file=/technology/epp/downloads/release/2018-12/R/eclipse-dsl-2018-12-R-linux-gtk-x86_64.tar.gz)


## Proceed as follows


### Step 1: Installation of Vorto DSL Plugins

1. Open Eclipse IDE
2. Download [Vorto DSL Plugins](https://download.eclipse.org/vorto/downloads/releases/0.10.0/org.eclipse.vorto.update-site-0.10.0.zip) and install it as an archive in your Eclipse IDE
3. Restart your Eclipse


### Step 2: Create your DSL Xtext Plugins

1. Create a new **DSL Xtext Project**
>File > New > Other > Xtext > Xtext Project

2. Choose a projectname and language name

3. Specify a file extension for your language, e.g. **mysdl**

3. Click on *Finish*.

After the wizard is finished, it will create five projects for you. 

Your Project Browser would look something like this:
 
- org.xtext.example.mydsl (core language plugin)
- org.xtext.example.mydsl.ide
- org.xtext.example.mydsl.ui 
- org.xtext.example.mydsl.tests
- org.xtext.example.mydsl.ui.tests

### Step 3: Reference Vorto Models from your DSL

We are primarily interested in the core language plugin, e.g. org.xtext.example.mydsl. 

1. Open the core language plugin and find the *.xtext grammar file
2. Replace the content with the following grammar:
		
		grammar org.xtext.example.mydsl.MyDsl with org.eclipse.xtext.common.Terminals
		
		import "http://www.eclipse.org/vorto/metamodel/InformationModel" as im
		
		generate myDsl "http://www.xtext.org/example/mydsl/MyDsl"
		
		Root:
			'namespace' namespace = QualifiedName
		    'version' version = VERSION
		     (references += ModelReference)*
			'system' name = ID '{'
				(model += Model)*
			'}';
			
		Model:
			name = ID 'as' type = [im::InformationModel | QualifiedName];
			
		QualifiedName:
			ID ('.' ID)*
		;
		
		terminal VERSION : ('0'..'9')* '.' ('0'..'9')* '.' ('0'..'9')*('-'ID)?;
		
		ModelReference : 
			'using' importedNamespace=QualifiedName';'version=VERSION
		;

As you can notice, it imports the Vorto Information Model Ecore and use it from your own DSL grammar.

3. Open the *.mwe2 Workflow file and add a reference to the Vorto Model Ecore files. Since we only use Vorto Information Models from our DSL, we just reference those. 

		...
		language = StandardLanguage {
			...
			referencedResource = "platform:/resource/org.eclipse.vorto.core/model/InformationModel.genmodel"
			referencedResource = "platform:/resource/org.eclipse.vorto.core/model/Model.genmodel"
		
			...
		}
				
4. Open the MANIFEST.MF file and add the following dependencies (under required bundles):

		 org.eclipse.vorto.core;bundle-version="0.10.0",
		 org.eclipse.vorto.editor;bundle-version="0.10.0",
		 org.eclipse.vorto.editor.infomodel;bundle-version="0.10.0"
		 
 
### Step 4: Generate Xtext Source Code 

If you are behind proxy, you would need to download ANTLR SDK manually, using the following Update Site: http://download.itemis.com/updates/. Once done so, please restart the IDE and continue with the following steps:

1. Find the **GenerateMyDsl.mwe2** Workflow file in the core plugin project. 
2. Right-click on the file and Run it. This will generate all necessary Xtext source code in order to run your language as an Eclipse Plugin

Now your language is all set. It's time to test it.

### Step 5: Run & Test your DSL

1. Right-click on the core plugin project (e.g. org.xtext.example.mydsl) and run it in a new Eclipse Workbench. A new Eclipse Workbench instance starts up for your language. It automatically loads all Vorto Eclipse Plugins as well as your DSL plugins.
2. Create a new simple project
3. Add a new Vorto Information Model file to the project or download it from the [Vorto Repository](https://vorto.eclipse.org)
 
 Here is an example of a Vorto Information Model _securitycamera.infomodel_:

		namespace org.mycompany.demo
		version 1.0.0
		displayname "Security Camera"
		infomodel SecurityCamera {
			// should contain function blocks, but omitting in this example
		}
4. Add a new file for your DSL. The autocompletion editor feature kicks in and suggests you the SecurityCamera Information Model to choose for a reference:

	Example:
		
		namespace org.mycompany.demo
		version 1.0.0
		using org.mycompany.demo.SecurityCamera;1.0.0
		system SmartBuilding {
			cameraFirstFloor as SecurityCamera
			cameraSecondFloor as SecurityCamera
		}
		
**Congratulations**! You have just created a simple Xtext language project which references Vorto Information Models. 
