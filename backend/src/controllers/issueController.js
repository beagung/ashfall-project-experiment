const supabase = require('../config/supabaseClient');

// Get All
exports.getAllIssues = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('issues')
            .select('*')
            .order('id_issue', { ascending: false }); // Urutkan berdasarkan kolom baru
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Issue (Fungsi penentu yang dipanggil di useEffect EditIssues)
exports.getIssueById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('issues')
            .select('*')
            .eq('id_issue', id) // Diubah ke id_issue tanpa menggunakan parseInt
            .single(); 

        if (error) throw error;
        if (!data) return res.status(404).json({ message: "Issue not found" });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create
exports.createIssue = async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    let imageUrl = null;

    try {
        if (file) {
            const fileName = `${Date.now()}_${file.originalname}`;
            const { error: uploadError } = await supabase.storage
                .from('issues') 
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (uploadError) throw uploadError;
            imageUrl = supabase.storage.from('issues').getPublicUrl(fileName).data.publicUrl;
        }

        const { data, error } = await supabase
            .from('issues')
            .insert([{ name, description, image_url: imageUrl }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateIssue = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    try {
        let updateData = { name, description };

        if (file) {
            // 1. Ambil data lama dengan target id_issue
            const { data: oldData } = await supabase.from('issues').select('image_url').eq('id_issue', id).single();
            
            // 2. Hapus file lama jika ada
            if (oldData?.image_url) {
                const oldFileName = oldData.image_url.split('/').pop();
                await supabase.storage.from('issues').remove([oldFileName]);
            }
            
            // 3. Upload file baru
            const fileName = `${Date.now()}_${file.originalname}`;
            const { error: uploadError } = await supabase.storage
                .from('issues')
                .upload(fileName, file.buffer, { contentType: file.mimetype });
            
            if (uploadError) throw uploadError;
            updateData.image_url = supabase.storage.from('issues').getPublicUrl(fileName).data.publicUrl;
        }

        const { data, error } = await supabase
            .from('issues')
            .update(updateData)
            .eq('id_issue', id) // Diubah ke id_issue
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete
exports.deleteIssue = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Ambil data lama dengan target id_issue
        const { data, error: fetchError } = await supabase.from('issues').select('image_url').eq('id_issue', id).single();
        if (fetchError) throw fetchError;

        if (data?.image_url) {
            const fileName = data.image_url.split('/').pop();
            await supabase.storage.from('issues').remove([fileName]);
        }

        // 2. Hapus baris data di database
        const { error } = await supabase.from('issues').delete().eq('id_issue', id);
        if (error) throw error;
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};